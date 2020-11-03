import { BasePage } from "/pages/BasePage";

const page = new BasePage();

fixture`Home`.page(page.baseUrl);

test('Correct title displays', async t => {
    await t
        .expect(page.title.textContent)
        .eql("name game")
});

test('Attempts counter increments after selecting a photo', async t => {
    const initialAttemptsCount = Number(await page.tries.textContent);

    await t.click(page.firstPhoto);

    const finalAttemptsCount = Number(await page.tries.textContent);

    await t
    .expect(finalAttemptsCount)
    .eql(initialAttemptsCount + 1);
});

//#########################
test('Streak counter increments on correct selections', async t => {
    await page.photos();

    const attempts = Math.floor(Math.random() * (4 - 2)) + 2;
    const initialStreakCount = Number(await page.streak.textContent);

    let counter = 1;

    while (counter <= attempts) {
        const initialName = String(await page.name.textContent);
        const photosCount = Number(await page.photos.count);

        for (let i = 0; i < photosCount; i++) {
            let photo = page.photos.nth(i);
            let photoName = String(await photo.child('div')
                .withAttribute('class', 'name')
                .textContent);

            if (initialName.localeCompare(photoName) === 0) {
                await t.click(photo);
                while (initialName.localeCompare(await page.name.textContent)===0){
                    await t.wait(3000);
                }
                break;
            }
        }
        counter++;
    }

    const finalStreakCount = Number(await page.streak.textContent);

    await t
        .expect(finalStreakCount)
        .eql(initialStreakCount + attempts);
});

test('Multiple streak counter resets on an incorrect answer', async t => {
    await page.photos();

    const attempts = Math.floor(Math.random() * (4 - 2)) + 2;

    const photosCount = Number(await page.photos.count);

    let counter = 1;

    while (counter <= attempts) {
        const initialName = String(await page.name.textContent);

        for (let i = 0; i < photosCount; i++) {
            let photo = page.photos.nth(i);
            let photoName = String(await photo.child('div')
                .withAttribute('class', 'name')
                .textContent);

            if (initialName.localeCompare(photoName) === 0) {
                await t.click(photo);
                while (initialName.localeCompare(await page.name.textContent)===0){
                    await t.wait(3000);
                }
                break;
            }
        }
        counter++;
    }

    for (let i = 0; i < photosCount; i++) {
        const currentName = String(await page.name.textContent);
        let photo = page.photos.nth(i);
        let photoName = String(await photo.child('div')
            .withAttribute('class', 'name')
            .textContent);

        if (currentName.localeCompare(photoName) === 1) {
            await t.click(photo);
            if (currentName.localeCompare(await page.name.textContent)===0){
                await t.wait(3000);
            }
            break;
        }
    }



    const finalStreakCount = Number(await page.streak.textContent);

    await t
        .expect(finalStreakCount)
        .eql(0);
});

test('Correct counters are being incremented', async t => {
    await page.photos();
    let attempts = Math.floor(Math.random() * (3 - 2)) + 2;
    let tryCount = Number(await page.tries.textContent);
    let correctCount = Number(await page.correct.textContent);
    const photosCount = Number(await page.photos.count);

    while (attempts >= 0) {
        const initialName = String(await page.name.textContent);

        for (let i = 0; i < photosCount; i++) {
            let photo = page.photos.nth(i);
            let photoName = String(await photo.child('div')
                .withAttribute('class', 'name')
                .textContent);

            if (initialName.localeCompare(photoName) === 0) {
                await t.click(photo);
                while (initialName.localeCompare(await page.name.textContent)===0){
                    await t.wait(3000);
                }

                await t
                    .expect(Number(await page.correct.textContent))
                    .eql(++correctCount);

                await t
                    .expect(Number(await page.tries.textContent))
                    .eql(++tryCount);
                break;
            }
        }
        attempts--;
    }

        for (let i = 0; i < photosCount; i++) {
            const currentName = String(await page.name.textContent);
            let photo = page.photos.nth(i);
            let photoName = String(await photo.child('div')
                .withAttribute('class', 'name')
                .textContent);

            if (currentName.localeCompare(photoName) === 1) {
                await t.click(photo);

                await t
                    .expect(Number(await page.correct.textContent))
                    .eql(correctCount);

                await t
                    .expect(Number(await page.tries.textContent))
                    .eql(++tryCount);
            }
        }
});

test('Name and displayed photos change', async t => {
    await page.photos();

    const photosCount = Number(await page.photos.count);
    const initialName = String(await page.name.textContent);
    let correctPhoto;
    let prevPhotos = Array(String);
    let nextPhotos = Array(String);

    for (let i = 0; i < photosCount; i++) {
            let photo = page.photos.nth(i);
            let photoName = String(await photo.child('div')
                .withAttribute('class', 'name')
                .textContent);

            let src = String(await photo.child('img')
                .getAttribute('src'));

            prevPhotos[i] = src.slice(src.lastIndexOf('/'));

            if (initialName.localeCompare(photoName) === 0) {
                correctPhoto = page.photos.nth(i);
            }
        }

    await t.click(correctPhoto);
    while (initialName.localeCompare(await page.name.textContent)===0){
        await t.wait(3000);
    }

    for (let i = 0; i < photosCount; i++) {
        let photo = page.photos.nth(i);

        let src = String(await photo.child('img')
            .getAttribute('src'));

        nextPhotos[i] = src.slice(src.lastIndexOf('/'));

        let result = (prevPhotos[i].localeCompare(nextPhotos[i]));

        if (result!==0){
            result = 56;
        }

        await t
            .expect(56)
            .eql(result);
        }
});