import React, { useState, ChangeEvent } from 'react'
import { orderBy, toPairs, map, mapValues, pickBy, Dictionary } from 'lodash'
import './App.css'

export default function App() {
  const [oldSign, setOldSign] = useState('')
  const [newSign, setNewSign] = useState('')

  const oldLetters = lettersInString(oldSign)
  const newLetters = lettersInString(newSign)

  const keepLetters = sortedLetters(union(oldLetters, newLetters, (a, b) => Math.min(a, b)))
  const grabLetters = sortedLetters(difference(newLetters, oldLetters))
  const takeLetters = sortedLetters(difference(oldLetters, newLetters))

  function onOldChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setOldSign(e.target.value)
  }

  function onNewChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setNewSign(e.target.value)
  }

  return (
    <main className="app">
      <h1 className="title">Church Sign Maker</h1>

      <div className="inputs">
        <textarea
          className="sign-input"
          placeholder="Old Sign"
          rows={2}
          value={oldSign}
          onChange={onOldChange}
        />
        <textarea
          className="sign-input"
          placeholder="New Sign"
          rows={2}
          value={newSign}
          onChange={onNewChange}
        />
      </div>

      <div className="letters-sections">
        <LettersList title="Grab New Letters" section="grab" letters={grabLetters} />
        <LettersList title="Keep Letters" section="keep" letters={keepLetters} />
        <LettersList title="Take Back Letters" section="take" letters={takeLetters} />
      </div>
    </main>
  )
}

interface LettersListProps {
  title: string
  letters: { letter: string; count: number }[]
  section: string
}

function LettersList({ title, letters, section }: LettersListProps) {
  if (letters.length === 0) {
    return null
  }

  return (
    <section className={`letters-section letters-section--${section}`}>
      <h3 className="letters-title">{title}</h3>
      <ul className="letters-list">
        {letters.map(({ letter, count }) => (
          <li key={letter} className="letter-item">
            <span className="letter">{letter}</span> × {count}
          </li>
        ))}
      </ul>
    </section>
  )
}

function lettersInString(str: string): Dictionary<number> {
  const letters = {}

  for (const chr of str.toUpperCase()) {
    if (isLetter(chr)) {
      if (!(chr in letters)) {
        letters[chr] = 0
      }

      letters[chr] += 1
    }
  }

  return letters
}

function isLetter(chr: string) {
  return chr.length === 1 && chr.match(/[a-z]/i)
}

function union<A, B, C>(a: Dictionary<A>, b: Dictionary<B>, map: (a: A, b: B) => C): Dictionary<C> {
  const output: Dictionary<C> = {}

  for (const key of Object.keys(a)) {
    if (key in b) {
      output[key] = map(a[key], b[key])
    }
  }

  return output
}

function difference(a: Dictionary<number>, b: Dictionary<number>) {
  return pickBy(mapValues(a, (count, key) => count - (b[key] || 0)), (count, _key) => count > 0)
}

function sortedLetters(dict: Dictionary<number>) {
  return orderBy(map(toPairs(dict), ([letter, count]) => ({ letter, count })), pair => pair.letter)
}
