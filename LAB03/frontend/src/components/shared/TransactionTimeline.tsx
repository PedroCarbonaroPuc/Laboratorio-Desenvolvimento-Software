import { motion } from 'framer-motion'
import type { Statement } from '../../types'

type TransactionTimelineProps = {
  statement: Statement
  dateFormatter: Intl.DateTimeFormat
}

function readableType(type: string) {
  return type.replaceAll('_', ' ')
}

export function TransactionTimeline({ statement, dateFormatter }: TransactionTimelineProps) {
  if (statement.transactions.length === 0) {
    return <p className="empty-ledger">Nenhuma movimentação registrada até o momento.</p>
  }

  return (
    <ul className="ledger-rail">
      {statement.transactions.map((transaction, index) => (
        <motion.li
          key={transaction.id}
          className={`ledger-item tone-${transaction.type.toLowerCase()}`}
          initial={{ opacity: 0, x: -6 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.24, delay: Math.min(index * 0.03, 0.18) }}
        >
          <span className="ledger-pin" aria-hidden="true" />

          <article>
            <header>
              <strong>{readableType(transaction.type)}</strong>
              <span>{transaction.amount} moedas</span>
            </header>

            <p>{transaction.description}</p>

            <footer>
              <small>Com: {transaction.counterpart}</small>
              {transaction.couponCode ? <small>Cupom: {transaction.couponCode}</small> : null}
              <small>{dateFormatter.format(new Date(transaction.createdAt))}</small>
            </footer>
          </article>
        </motion.li>
      ))}
    </ul>
  )
}
