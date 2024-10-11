import assert from 'node:assert/strict'
import test from 'node:test'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import rehypeUnwrapImages from 'rehype-unwrap-images'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'

test('rehypeUnwrapImages', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('rehype-unwrap-images')).sort(), [
      'default'
    ])
  })

  await t.test('should unwrap images', async function () {
    assert.equal(
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeUnwrapImages)
          .use(rehypeStringify)
          .process('<p><img alt="hi" src="there.png"></p>')
      ),
      '<img alt="hi" src="there.png">'
    )
  })

  await t.test(
    'should unwrap multiple images, w/ whitespace',
    async function () {
      assert.equal(
        String(
          await unified()
            .use(rehypeParse, {fragment: true})
            .use(rehypeUnwrapImages)
            .use(rehypeStringify)
            .process(
              '<p><img alt="alpha" src="alpha.png"> <img alt="bravo" src="bravo.png"></p>'
            )
        ),
        '<img alt="alpha" src="alpha.png"> <img alt="bravo" src="bravo.png">'
      )
    }
  )

  await t.test('should not unwrap images next to text', async function () {
    assert.equal(
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeUnwrapImages)
          .use(rehypeStringify)
          .process('<p>some text <img alt="and" src="and.png"> an image</p>')
      ),
      '<p>some text <img alt="and" src="and.png"> an image</p>'
    )
  })

  await t.test('should not unwrap if there are no images', async function () {
    assert.equal(
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeUnwrapImages)
          .use(rehypeStringify)
          .process('<p>some text</p>')
      ),
      '<p>some text</p>'
    )
  })

  await t.test(
    'should not unwrap if there are no images in links',
    async function () {
      assert.equal(
        String(
          await unified()
            .use(rehypeParse, {fragment: true})
            .use(rehypeUnwrapImages)
            .use(rehypeStringify)
            .process('<p><a href="#hi"></a></p>')
        ),
        '<p><a href="#hi"></a></p>'
      )
    }
  )

  await t.test('should supports images in links', async function () {
    assert.equal(
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeUnwrapImages)
          .use(rehypeStringify)
          .process('<p><a href="#hi"><img alt="hi" src="there.png"></a></p>')
      ),
      '<a href="#hi"><img alt="hi" src="there.png"></a>'
    )
  })

  await t.test(
    'should not unwrap links next to other content',
    async function () {
      assert.equal(
        String(
          await unified()
            .use(rehypeParse, {fragment: true})
            .use(rehypeUnwrapImages)
            .use(rehypeStringify)
            .process('<p><a href="#hi"><img alt="hi" src="there.png"></a>!</p>')
        ),
        '<p><a href="#hi"><img alt="hi" src="there.png"></a>!</p>'
      )
    }
  )

  await t.test('should not unwrap links with other content', async function () {
    assert.equal(
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeUnwrapImages)
          .use(rehypeStringify)
          .process(
            '<p><a href="#hi"><img alt="Hello" src="there.png">, world</a></p>'
          )
      ),
      '<p><a href="#hi"><img alt="Hello" src="there.png">, world</a></p>'
    )
  })

  await t.test('should integrate w/ remark', async function () {
    assert.equal(
      String(
        await unified()
          .use(remarkParse)
          .use(remarkRehype)
          .use(rehypeUnwrapImages)
          .use(rehypeStringify)
          .process('![hi][image]\n\n![hi](there.png)\n\n[image]: kitten.png')
      ),
      '<img src="kitten.png" alt="hi">\n<img src="there.png" alt="hi">'
    )
  })
})
