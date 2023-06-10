import ReactMarkdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dark, oneLight} from 'react-syntax-highlighter/dist/esm/styles/prism'
interface IProps {
  content: string
}

export default (props: IProps) => {
  const { content } = props

  return<div style={{background:'white', padding:12}}> <ReactMarkdown
    children={content}
    components={{
      code({node, inline, className, children, ...props}) {
        const match = /language-(\w+)/.exec(className || '')
        return !inline && match ? (
          <SyntaxHighlighter
            {...props}
            children={String(children).replace(/\n$/, '')}
            style={oneLight}
            language={match[1]}
            PreTag="div"
          />
        ) : (
          <code {...props} className={className}>
            {children}
          </code>
        )
      }
    }}
  /></div>
}
