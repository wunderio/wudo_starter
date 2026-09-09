<?php

namespace Drupal\wudo_theme_extension\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Datetime\DateFormatterInterface;
use Drupal\Core\File\FileUrlGeneratorInterface;
use Drupal\Core\Render\RenderContext;
use Drupal\Core\Render\RendererInterface;
use Drupal\node\NodeInterface;
use Drupal\views\Views;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Renders a View display as JSON with HTML card output and pager metadata.
 */
class ViewsRenderController extends ControllerBase {

  public function __construct(
    private readonly RendererInterface $renderer,
    private readonly DateFormatterInterface $dateFormatter,
    private readonly FileUrlGeneratorInterface $fileUrlGenerator,
  ) {}

  public static function create(ContainerInterface $container): static {
    return new static(
      $container->get('renderer'),
      $container->get('date.formatter'),
      $container->get('file_url_generator'),
    );
  }

  public function render(string $view_id, string $display_id, Request $request): JsonResponse {
    $view = Views::getView($view_id);

    if (!$view || !$view->access($display_id)) {
      return new JsonResponse(['error' => 'View not found'], 404);
    }

    $view->setDisplay($display_id);

    $page = $request->query->get('page', 0);
    $view->setCurrentPage($page);
    $view->execute();

    $items_html = [];

    foreach ($view->result as $row) {
      $node = $row->_entity;
      if (!$node instanceof NodeInterface) continue;

      $build = [
        '#type' => 'component',
        '#component' => 'wudo:article-card',
        '#props' => [
          'title' => $node->label(),
          'url' => $node->toUrl()->toString(),
          'summary' => $node->hasField('body') ? $node->get('body')->summary : '',
          // Array is coerced to an object when passed to Twig.
          'image' => [
            'src' => $this->getThumbnailUrl($node),
            'alt' => $node->label(),
          ],
          'date' => $this->dateFormatter->format($node->getCreatedTime(), 'custom', 'd M Y - H:i'),
        ],
      ];

      $items_html[] = $this->renderer->executeInRenderContext(new RenderContext(), function () use ($build) {
        return (string) $this->renderer->render($build);
      });
    }

    $pager = $view->pager;
    $has_more = FALSE;
    $total_items = 0;

    if ($pager) {
      $total_items = $pager->getTotalItems();
      $total_pages = ceil($total_items / $pager->getItemsPerPage());
      $has_more = ($page + 1) < $total_pages;
    }

    return new JsonResponse([
      'html' => implode('', $items_html),
      'title' => (string) $view->getTitle(),
      'pager' => [
        'current_page' => (int) $page,
        'total_items' => (int) $total_items,
        'has_more' => $has_more,
      ],
    ]);
  }

  private function getThumbnailUrl(NodeInterface $node): string {
    if ($node->hasField('field_image') && !$node->get('field_image')->isEmpty()) {
      $file = $node->get('field_image')->entity;
      if ($file) {
        return $this->fileUrlGenerator->generateString($file->getFileUri());
      }
    }
    return '';
  }

}
