const fs = require('fs')
const colors = require('colors')

const { DIFFICULTIES } = require('../common')
const { getProblem, getProblemDetail } = require('../store')

// Generate file top information
function getMeta(problem) {
  const { stat } = problem
  const meta = [
    stat.frontend_question_id + '. ' + stat.question__title,
    DIFFICULTIES[problem.difficulty.level - 1] + '   ' +
      (stat.total_acs / stat.total_submitted * 100).toFixed() + '%'
  ]
  return meta.map(len => '// ' + len + '\n').join('')
}

function unescape(str) {
  const unescapeMap = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x60;': '`',
    '&#39;': "'",
  }
  for (let escaper in unescapeMap) {
    str = str.replace(new RegExp(escaper, 'g'), unescapeMap[escaper])
  }
  return str
}

function toText(html) {
  html = html.replace(/<[^>]+>/gm, '') // remove tags
  html = html.replace(/\r/gm, '')      // remove \r
  html = html.replace(/\n+/gm, '\n')   // remove surplus \n
  return html
}

// Split a line word less than 80 & add // at the head
function unfill(value) {
  if (value === '') return value
  return value
    .split(' ')
    .reduce((lines, word, i) => {
      const tail = lines.length - 1
      if (lines[tail].length + word.length > 80) {
        lines[tail + 1] = '// ' + word
      } else {
        lines[tail] += (i ? ' ' : '// ') + word
      }
      return lines
    }, [''])
    .join('\n')
}

function getDescription(content) {
  content = toText(content)
  content = unescape(content)
  content = content.replace(/\n\s\n/gm, '\n\n')
  content = content.replace(/\t/g, '    ')
  content = content.split('\n').map(s => s.trimRight()).map(unfill).join('\n')
  return content
}

function getDefaultCode(code) {
  return JSON.parse(code)
    .find(lang => lang.value === 'javascript').defaultCode
    .replace('\nvar ', '\nconst ')
    .replace('    ', '')
    .replace(/;$/, '')
}

function getTestCode(str) {
  const argv = str.replace(/"/g, "'").split('\n')
  const argvStr = argv.length > 1 ? argv.join(', ') : argv[0]
  return `;[\n  [${ argvStr }],\n].forEach(() => {\n\n})`
}

function getSolutionString() {
  return '// Solution:'
}

function getAcceptString() {
  return '// Submission Result: Accept'
}

module.exports = function generate(number) {
  const problem = getProblem(number)
  if (fs.existsSync(problem.filePath)) {
    throw new Error('File <' + problem.filename + '> already exists.')
  }

  getProblemDetail(problem, function(detail) {
    const { content, codeDefinition, sampleTestCase } = detail
    const meta = getMeta(problem)
    const description = getDescription(content)
    const defaultCode = getDefaultCode(codeDefinition)
    const testCode = getTestCode(sampleTestCase)
    const solution = getSolutionString()
    const accept = getAcceptString()

    fs.writeFileSync(
      problem.filePath,
      [meta, description, defaultCode, testCode, solution, accept].join('\n\n'),
      'utf8'
    )
    console.log(`Generate File: <${colors.yellow(problem.filename)}>.`)
  })
}
