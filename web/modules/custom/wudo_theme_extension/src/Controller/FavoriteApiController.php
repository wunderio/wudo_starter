<?php

namespace Drupal\wudo_theme_extension\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\node\Entity\Node;
use Drupal\Core\Render\RendererInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class FavoriteApiController extends ControllerBase {

  public function __construct(
    protected RendererInterface $renderer,
    protected EntityTypeManagerInterface $entityManager,
  ) {}

  public static function create(ContainerInterface $container): static {
    return new static(
      $container->get('renderer'),
      $container->get('entity_type.manager'),
    );
  }

  public function getTeasers(Request $request) {
    $ids_raw = $request->query->get('ids');
    if (empty($ids_raw)) {
      return new JsonResponse([]);
    }

    // Clean and split the IDs
    $ids = array_filter(explode(',', $ids_raw));
    if (empty($ids)) {
      return new JsonResponse([]);
    }

    $nodes = Node::loadMultiple($ids);
    $result = [];

    foreach ($nodes as $node) {
      // Check if the user has access to view the node
      if (!$node->access('view')) {
        continue;
      }

      $build = $this->entityManager
        ->getViewBuilder('node')
        ->view($node, 'card');

      $result[] = [
        'id' => $node->id(),
        'html' => (string) $this->renderer->renderInIsolation($build),
      ];
    }

    return new JsonResponse($result);
  }
}
