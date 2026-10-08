<?php

namespace Drupal\wudo_theme_extension\Controller;

use Drupal\Core\Cache\CacheableJsonResponse;
use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Render\RenderContext;
use Drupal\Core\Render\RendererInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * Returns favorite nodes rendered as cards.
 */
final class FavoriteApiController extends ControllerBase {

  /**
   * The most nodes a single request can ask for.
   */
  const MAX_IDS = 50;

  public function __construct(
    protected RendererInterface $renderer,
    protected EntityTypeManagerInterface $entityManager,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container): static {
    return new self(
      $container->get('renderer'),
      $container->get('entity_type.manager'),
    );
  }

  /**
   * Returns the nodes given in the "ids" query argument as rendered cards.
   */
  public function getTeasers(Request $request): CacheableJsonResponse {
    $cacheability = (new CacheableMetadata())
      ->addCacheContexts(['url.query_args:ids']);

    // Keep numeric IDs only, without duplicates, and cap their number.
    $ids = array_filter(explode(',', (string) $request->query->get('ids')), 'ctype_digit');
    $ids = array_slice(array_unique($ids), 0, self::MAX_IDS);

    $result = [];
    $storage = $this->entityManager->getStorage('node');
    $view_builder = $this->entityManager->getViewBuilder('node');

    foreach ($storage->loadMultiple($ids) as $node) {
      $access = $node->access('view', NULL, TRUE);
      $cacheability->addCacheableDependency($access)->addCacheableDependency($node);
      if (!$access->isAllowed()) {
        continue;
      }

      $build = $view_builder->view($node, 'card');
      $html = $this->renderer->executeInRenderContext(new RenderContext(), fn () => (string) $this->renderer->render($build));
      $cacheability->addCacheableDependency(CacheableMetadata::createFromRenderArray($build));

      $result[] = [
        'id' => $node->id(),
        'html' => $html,
      ];
    }

    return (new CacheableJsonResponse($result))->addCacheableDependency($cacheability);
  }

}
