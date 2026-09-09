<?php

namespace Drupal\wudo_theme_extension\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\node\Entity\Node;
use Drupal\Core\Render\RendererInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class FavoriteApiController extends ControllerBase {

  protected $renderer;

  public function __construct(RendererInterface $renderer) {
    $this->renderer = $renderer;
  }

  public static function create(ContainerInterface $container) {
    return new static($container->get('renderer'));
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

      $build = [
        '#type' => 'component',
        '#component' => 'wudo:article-card',
        '#props' => [
          'id' => $node->id(),
          'title' => $node->label(),
          'url' => $node->toUrl()->toString(),
          'image' => [
            'src' => $this->getThumbnailUrl($node),
            'alt' => $node->label(),
          ],
        ],
      ];

      $result[] = [
        'id' => $node->id(),
        'html' => $this->renderer->renderPlain($build)->__toString(),
      ];
    }

    return new JsonResponse($result);
  }

  private function getThumbnailUrl($node) {
    // Adjust field_image to your actual image field machine name
    if ($node->hasField('field_image') && !$node->get('field_image')->isEmpty()) {
      $file = $node->get('field_image')->entity;
      if ($file) {
        return \Drupal::service('file_url_generator')->generateString($file->getFileUri());
      }
    }
    // Empty image fallback
    return '/' . \Drupal::theme()->getActiveTheme()->getPath() . '/assets/no-image.jpg';
  }
}
