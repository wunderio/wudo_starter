<?php

namespace Drupal\wudo_theme_extension\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\File\FileUrlGeneratorInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\node\Entity\Node;
use Drupal\Core\Render\RendererInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\node\NodeInterface;

class FavoriteApiController extends ControllerBase {

  public function __construct(
    protected RendererInterface $renderer,
    protected FileUrlGeneratorInterface $fileUrlGenerator,
  ) {}

  public static function create(ContainerInterface $container): static {
    return new static(
      $container->get('renderer'),
      $container->get('file_url_generator'),
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
        'html' => (string) $this->renderer->renderInIsolation($build),
      ];
    }

    return new JsonResponse($result);
  }

  private function getThumbnailUrl(NodeInterface $node): string {
    if ($node->hasField('field_image') && !$node->get('field_image')->isEmpty()) {
      $media = $node->get('field_image')->entity;
      if ($media && $media->hasField('field_media_image') && !$media->get('field_media_image')->isEmpty()) {
        $file = $media->get('field_media_image')->entity;
        if (!$file) {
          return '';
        }
        return $this->fileUrlGenerator->generateString($file->getFileUri());
      }
    }
    return '';
  }
}
