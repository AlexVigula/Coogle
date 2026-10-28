// Данный скрип автоматичерски ставит найденные чекбоксы в истории браузера, тк в хроме нету встароенный функции отметить все, и приходится ставить в ручную на каждый, благодаря скрипту это происходит быстрее.
(async () => {
  // Функция для глубокого поиска элементов, проникающая во все Shadow DOM
  function findDeep(selector, root = document) {
    let elements = Array.from(root.querySelectorAll(selector));
    root.querySelectorAll('*').forEach(el => {
      if (el.shadowRoot) {
        elements = elements.concat(findDeep(selector, el.shadowRoot));
      }
    });
    return elements;
  }

  // Ищем все компоненты history-item
  const items = findDeep('history-item');
  console.log(`Найдено записей на экране: ${items.length}`);

  let clicked = 0;

  for (const item of items) {
    // Заходим в Shadow DOM элемента history-item
    const cb = item.shadowRoot?.querySelector('cr-checkbox');
    if (!cb) continue;

    // Заходим в Shadow DOM самого чекбокса
    const box = cb.shadowRoot?.querySelector('[role="checkbox"]');
    if (!box) continue;

    const isChecked = box.getAttribute('aria-checked') === 'true';
    if (!isChecked) {
      box.click();
      clicked++;
      // Небольшая пауза, чтобы интерфейс не зависал
      await new Promise(r => setTimeout(r, 20));
    }
  }

  console.log(`Успешно отмечено: ${clicked}`);
})();
