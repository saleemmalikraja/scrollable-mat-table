import { WidgetScrollableDataTableModule } from './widget-scrollable-data-table.module';

describe('WidgetScrollableDataTableModule', () => {
  let widgetScrollableDataTableModule: WidgetScrollableDataTableModule;

  beforeEach(() => {
    widgetScrollableDataTableModule = new WidgetScrollableDataTableModule();
  });

  it('should create an instance', () => {
    expect(widgetScrollableDataTableModule).toBeTruthy();
  });
});
