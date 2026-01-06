'use client'

import { useEffect, useState } from 'react'

interface PostContentProps {
  content: string
}

export default function PostContent({ content }: PostContentProps) {
  const [parsedContent, setParsedContent] = useState<JSX.Element[]>([])

  useEffect(() => {
    const parseContent = () => {
      const elements: JSX.Element[] = []
      const lines = content.split('\n')
      let currentParagraph: string[] = []
      let listItems: string[] = []
      let inList = false

      lines.forEach((line, index) => {
        const trimmedLine = line.trim()

        // Headings
        if (trimmedLine.startsWith('## ')) {
          if (currentParagraph.length > 0) {
            elements.push(
              <p key={`p-${index}`} className="mb-6 text-lg text-gray-700 leading-relaxed">
                {currentParagraph.join(' ')}
              </p>
            )
            currentParagraph = []
          }
          elements.push(
            <h2 key={`h2-${index}`} className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              {trimmedLine.substring(3)}
            </h2>
          )
          return
        }

        if (trimmedLine.startsWith('### ')) {
          if (currentParagraph.length > 0) {
            elements.push(
              <p key={`p-${index}`} className="mb-6 text-lg text-gray-700 leading-relaxed">
                {currentParagraph.join(' ')}
              </p>
            )
            currentParagraph = []
          }
          elements.push(
            <h3 key={`h3-${index}`} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              {trimmedLine.substring(4)}
            </h3>
          )
          return
        }

        // Lists
        if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
          if (!inList && currentParagraph.length > 0) {
            elements.push(
              <p key={`p-${index}`} className="mb-6 text-lg text-gray-700 leading-relaxed">
                {currentParagraph.join(' ')}
              </p>
            )
            currentParagraph = []
          }
          inList = true
          listItems.push(trimmedLine.substring(2))
          return
        }

        if (trimmedLine.match(/^\d+\.\s/)) {
          if (!inList && currentParagraph.length > 0) {
            elements.push(
              <p key={`p-${index}`} className="mb-6 text-lg text-gray-700 leading-relaxed">
                {currentParagraph.join(' ')}
              </p>
            )
            currentParagraph = []
          }
          inList = true
          listItems.push(trimmedLine.replace(/^\d+\.\s/, ''))
          return
        }

        // End of list
        if (inList && trimmedLine === '') {
          elements.push(
            <ul key={`ul-${index}`} className="list-disc list-inside mb-6 space-y-2 text-lg text-gray-700 ml-4">
              {listItems.map((item, i) => (
                <li key={i} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          )
          listItems = []
          inList = false
          return
        }

        // Regular paragraphs
        if (trimmedLine === '') {
          if (currentParagraph.length > 0) {
            elements.push(
              <p key={`p-${index}`} className="mb-6 text-lg text-gray-700 leading-relaxed">
                {currentParagraph.join(' ')}
              </p>
            )
            currentParagraph = []
          }
        } else {
          currentParagraph.push(trimmedLine)
        }
      })

      // Add remaining content
      if (currentParagraph.length > 0) {
        elements.push(
          <p key="p-final" className="mb-6 text-lg text-gray-700 leading-relaxed">
            {currentParagraph.join(' ')}
          </p>
        )
      }

      if (listItems.length > 0) {
        elements.push(
          <ul key="ul-final" className="list-disc list-inside mb-6 space-y-2 text-lg text-gray-700 ml-4">
            {listItems.map((item, i) => (
              <li key={i} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        )
      }

      setParsedContent(elements)
    }

    parseContent()
  }, [content])

  return (
    <article className="prose prose-lg max-w-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="post-content">
          {parsedContent}
        </div>
      </div>
    </article>
  )
}