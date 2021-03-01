const Page = require('./helpers/page');

let page;

beforeEach(async () => {    
    page = await Page.build();
    await page.goto('http://localhost:3000');
})

afterEach(async () => {
    await page.close();
})

test('When logged in, can see blog create form', async () => {
    await page.login();
    await page.click('a.btn-floating');

    const label = await page.getContentsOf('form label');

    expect(label).toEqual('Blog Title');

})


describe('When logged in', async () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating')
    })

    test('can see blog create form', async () => {
        const label = await page.getContentsOf('form label');
        expect(label).toEqual('Blog Title')
    })

    describe('And using Valid inputs', async() => {
        beforeEach(async () => {
            await page.type('.title input', 'myTitle');
            await page.type('.content input', 'myContent');
            await page.click('form button')
        })
        test('Submitting takes user to review screen', async() => {
            const text = await page.getContentsOf('h5');
            expect(text).toEqual('Please confirm your entries');
        })

        test('Submitting then saving adds blog to index page', async () => {
            await page.click('button.green');
            await page.waitFor('.card');

            const title = await page.getContentsOf('.card-title');
            const content = await page.getContentsOf('p');
            expect(title).toEqual('myTitle');
            expect(content).toEqual('myContent');

        })
    })

    describe('And using invalid inputs', async () => {
        beforeEach(async ()=> {
            await page.click('form button');
        })
        test('the form shows an error message', async () => {
            const titleError = await page.getContentsOf('.title .red-text');
            const contentError = await page.getContentsOf('.content .red-text');

            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');
        })
    });
})

describe('when user not logged in', async () => {
    test('User cannot create blog posts', async ()=> {
        const result = await page.post('/api/blogs', { title: 'My Title', content: 'My Contents'})
        // console.log(result);
        expect(result).toEqual({ error: 'You must log in!' });
    })

    test('User cannot get blogs', async () => {
        const result = await page.get('/api/blogs');
        expect(result).toEqual({ error: 'You must log in!' });
    })

    const actions = [
        {
            method: 'get',
            path: '/api/blogs'
        },
        {
            method: 'post',
            path: '/api/blogs',
            data: { title : 'T', content: 'C'}
        }
    ]
    test('Blog access is restricted', async () => {
        const results = await page.execRequests(actions);

        for ( let result of results ) {
            expect(result).toEqual( { error: 'You must log in!' })
        }

    })

})