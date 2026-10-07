<?php

declare(strict_types=1);

namespace Drupal\wudo_theme_extension\EventSubscriber;

use Drupal\Core\DefaultContent\ExportMetadata;
use Drupal\Core\DefaultContent\Exporter;
use Drupal\Core\DefaultContent\PreExportEvent;
use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityRepositoryInterface;
use Drupal\Core\Field\FieldItemInterface;
use Drupal\pathauto\PathautoState;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Makes paragraphs and path aliases exportable as default content.
 *
 * Core exports entity_reference_revisions items as raw IDs, which point at
 * nothing on another site. Paragraphs are exported inline in their parent
 * instead, which the core importer already knows how to read.
 *
 * Pathauto ignores an imported alias unless the item says it was set by hand.
 */
class DefaultContentSubscriber implements EventSubscriberInterface {

  public function __construct(
    private readonly Exporter $exporter,
    private readonly EntityRepositoryInterface $entityRepository,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents(): array {
    // Run after core's path subscriber so its callback can be extended.
    return [PreExportEvent::class => ['preExport', -10]];
  }

  /**
   * Reacts before an entity is exported.
   */
  public function preExport(PreExportEvent $event): void {
    // The parent reference is restored when the parent entity is saved.
    $entity_type = $event->entity->getEntityType();
    foreach (['entity_revision_parent_type_field', 'entity_revision_parent_id_field', 'entity_revision_parent_field_name_field'] as $key) {
      if ($field_name = $entity_type->get($key)) {
        $event->setExportable($field_name, FALSE);
      }
    }

    $event->setCallback('field_item:entity_reference_revisions', function (FieldItemInterface $item, ExportMetadata $metadata): ?array {
      $entity = $item->get('entity')->getValue();
      if (!$entity instanceof ContentEntityInterface) {
        return NULL;
      }
      $result = $this->exporter->export($entity);

      // Nested entities are resolved against the dependencies of the entity
      // they are embedded in.
      foreach ($result->metadata->getDependencies() as $dependency) {
        $dependency = $this->entityRepository->loadEntityByUuid(...$dependency);
        if ($dependency instanceof ContentEntityInterface) {
          $metadata->addDependency($dependency);
        }
      }
      return ['entity' => ['_meta' => $result->metadata->get()] + $result->data];
    });

    $export_path = $event->getCallbacks()['field_item:path'] ?? NULL;
    if ($export_path) {
      $event->setCallback('field_item:path', function (FieldItemInterface $item, ExportMetadata $metadata) use ($export_path): ?array {
        $values = $export_path($item, $metadata);
        if (!empty($values['alias']) && $item->getDataDefinition()->getPropertyDefinition('pathauto')) {
          $values['pathauto'] = PathautoState::SKIP;
        }
        return $values;
      });
    }
  }

}
