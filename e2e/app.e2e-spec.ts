import { FontendTestCalendarPage } from './app.po';

describe('fontend-test-calendar App', () => {
  let page: FontendTestCalendarPage;

  beforeEach(() => {
    page = new FontendTestCalendarPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
