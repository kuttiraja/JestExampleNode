
const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    
    page = await Page.build();
    await page.goto('localhost:3000');
})

afterEach(async () => {
    await page.close();
})

test('Header has the correct text', async () => {
    
    const text = await page.getContentsOf('a.brand-logo');
    expect(text).toEqual('Blogster')

});

test('clicking login starts OAuth flow', async () => {
    await page.click('.right a');
    const url = await page.url();
    // console.log(url);
    expect(url).toMatch(/accounts\.google\.com/);
})

test('when signed in, shows logout button', async () => {
    
    await page.login();

    const text = await page.getContentsOf('a[href="/auth/logout"]');
    expect(text).toEqual("Logout");
    
})


