<?php

namespace Drupal\wudo_theme_extension\Controller;

use Drupal\Core\Cache\CacheableJsonResponse;
use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Render\RenderContext;
use Drupal\Core\Render\RendererInterface;
use Drupal\node\NodeInterface;
use Drupal\views\Views;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * Renders a View display as JSON with HTML card output and pager metadata.
 *
 * Only the views listed in wudo_theme_extension.settings:api_views are served.
 */
final class ViewsRenderController extends ControllerBase {

  public function __construct(
    private readonly RendererInterface $renderer,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container): static {
    return new self(
      $container->get('renderer'),
    );
  }

  /**
   * Returns one page of a view as rendered cards.
   */
  public function render(string $view_id, string $display_id, Request $request): CacheableJsonResponse {
    $settings = $this->config('wudo_theme_extension.settings');
    $cacheability = (new CacheableMetadata())
      ->addCacheableDependency($settings)
      ->addCacheContexts(['url.query_args:page', 'user.permissions']);

    $view = in_array($view_id, $settings->get('api_views') ?? [], TRUE) ? Views::getView($view_id) : NULL;
    if (!$view || !$view->access($display_id)) {
      return (new CacheableJsonResponse(['error' => 'View not found'], 404))->addCacheableDependency($cacheability);
    }

    $page = (string) $request->query->get('page', '0');
    if (!ctype_digit($page)) {
      return (new CacheableJsonResponse(['error' => 'Invalid page'], 400))->addCacheableDependency($cacheability);
    }
    $page = (int) $page;

    $view->setDisplay($display_id);
    $view->setCurrentPage($page);
    $view->execute();
    $cacheability->addCacheTags($view->getCacheTags());

    $items_html = [];
    $view_builder = $this->entityTypeManager()->getViewBuilder('node');

    foreach ($view->result as $row) {
      $node = $row->_entity;
      if (!$node instanceof NodeInterface) {
        continue;
      }

      // The same card the favorites endpoint returns.
      $build = $view_builder->view($node, 'card');
      $items_html[] = $this->renderer->executeInRenderContext(new RenderContext(), function () use (&$build) {
        return (string) $this->renderer->render($build);
      });
      $cacheability
        ->addCacheableDependency($node)
        ->addCacheableDependency(CacheableMetadata::createFromRenderArray($build));
    }

    $pager = $view->pager;
    $total_items = $pager->getTotalItems();
    $items_per_page = $pager->getItemsPerPage();
    $has_more = $items_per_page > 0 && ($page + 1) < ceil($total_items / $items_per_page);

    return (new CacheableJsonResponse([
      'html' => implode('', $items_html),
      'title' => (string) $view->getTitle(),
      'pager' => [
        'current_page' => $page,
        'total_items' => (int) $total_items,
        'has_more' => $has_more,
      ],
    ]))->addCacheableDependency($cacheability);
  }

}
