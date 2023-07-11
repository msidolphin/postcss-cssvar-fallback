const postcss = require('postcss')
const path = require('path')

const plugin = require('./')

async function run (input, output) {
  let result = await postcss([plugin({
    path: path.join(__dirname, './test.theme.css')
  })]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}


it('test1', async () => {
  await run(`
    .test {
      color: rgba(var(--kd-color-purple-10), 1);
    }
  `, `
    .test {
      color: rgba(var(--kd-color-purple-10, 102, 16, 59), 1);
    }
  `, { })
})

it(`test2`, async () => {
  await run(`
    .test {
      color: var(--kd-color-public-normal);
    }
  `, `
    .test {
      color: var(--kd-color-public-normal, rgba(var(--kd-color-blue-6, 10, 108, 255), 1));
    }
  `)
})

it(`test3`, async () => {
  await run(`
    .test {
      border: 1px sold var(--kd-color-public-normal);
    }
  `, `
    .test {
      border: 1px sold var(--kd-color-public-normal, rgba(var(--kd-color-blue-6, 10, 108, 255), 1));
    }
  `)
})

it(`test4`, async () => {
  await run(`
    .test {
      border: var(--kd-font-size-small) sold var(--kd-color-public-normal);
    }
  `, `
    .test {
      border: var(--kd-font-size-small, 12px) sold var(--kd-color-public-normal, rgba(var(--kd-color-blue-6, 10, 108, 255), 1));
    }
  `)
})

it(`test5`, async () => {
  await run(`
    .test {
      height: calc(var(--kd-font-size-small) + var(--kd-font-size-base));
    }
  `, `
    .test {
      height: calc(var(--kd-font-size-small, 12px) + var(--kd-font-size-base, 14px));
    }
  `)
})

it('ignore', async () => {
  await run(`
    .test {
      color: var(--kd-color-line-brand, #000);
    }
  `, `
    .test {
      color: var(--kd-color-line-brand, #000);
    }
  `)
})
