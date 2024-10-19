const fs = require('fs')

const parseProgram = () => {
    const srcPath = './data/program/data.json';
    const target = './site/content/fi/ohjelmisto'

    if (fs.existsSync(target)) {
        fs.rmSync(target, {
            recursive: true,
            force: true
        })
    }
    fs.mkdirSync(target)

    const authors = JSON.parse(fs.readFileSync(srcPath))
        .reduce((result, item) => {
            return ({ ...result, [item.author]: [...(result[item.author] || []), item] })
        }, {})
    const contentPerAuthor = Object.keys(authors)
        .reduce((result, item) => {
            const poems = authors[item].sort((a, b) => {
                return a.title > b.title ? 1 : -1
            })
        .map(poem => `${poem.title}\n${poem.translator ? `suom. ${poem.translator}\n` : ''}`)
        .join('\n')
        return { ...result, [item]: poems }
        }, {})

    const content = `
---
title: "Ohjelmisto"
omit_header_text: true
---

Kaikki sävellykset ja sovitukset **Petra Lampinen**

## Runot

${Object.keys(authors).sort((a, b) => {
        return a.split(" ")[1] > b.split(" ")[1] ? 1 : -1
    }).map(item => `\n---\n### ${item}\n\n${contentPerAuthor[item]}`).join("\n\n")}

`
    fs.writeFileSync(`${target}/_index.md`, content)
}

module.exports = parseProgram
