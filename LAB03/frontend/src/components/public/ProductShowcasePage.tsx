import { motion } from 'framer-motion'
import { useMemo } from 'react'
import type { Benefit } from '../../types'

type ProductShowcasePageProps = {
  benefits: Benefit[]
}

const EASE_OUT: [number, number, number, number] = [0.2, 0.8, 0.2, 1]

export function ProductShowcasePage({ benefits }: ProductShowcasePageProps) {
  const orderedBenefits = useMemo(() => {
    return [...benefits].sort((a, b) => a.costCoins - b.costCoins)
  }, [benefits])

  const averageCost = useMemo(() => {
    if (orderedBenefits.length === 0) {
      return 0
    }

    const total = orderedBenefits.reduce((sum, item) => sum + item.costCoins, 0)
    return Math.round(total / orderedBenefits.length)
  }, [orderedBenefits])

  return (
    <section className="catalog-only-page">
      <motion.header
        className="catalog-only-hero"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE_OUT }}
      >
        <div>
          <p className="eyebrow">Vitrine do sistema</p>
          <h2>Vantagens ativas para resgate</h2>
          <p className="muted">
            Explore todos os produtos publicados por parceiros e escolha sua proxima experiencia no ecossistema de
            moeda estudantil.
          </p>
        </div>

        <div className="catalog-only-kpis">
          <article>
            <span>Itens disponiveis</span>
            <strong>{orderedBenefits.length}</strong>
          </article>
          <article>
            <span>Custo medio</span>
            <strong>{averageCost} moedas</strong>
          </article>
        </div>
      </motion.header>

      {orderedBenefits.length === 0 ? (
        <section className="catalog-empty">
          <h3>Nenhuma vantagem publicada ainda</h3>
          <p className="muted">Assim que parceiros cadastrarem itens, eles aparecerao aqui nesta vitrine.</p>
        </section>
      ) : (
        <div className="catalog-only-grid">
          {orderedBenefits.map((benefit, index) => (
            <motion.article
              key={benefit.id}
              className="catalog-only-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.24), ease: EASE_OUT }}
            >
              <div className="catalog-only-media">
                <img src={benefit.imageUrl} alt={benefit.title} loading="lazy" />
                <span>{benefit.partnerName}</span>
              </div>

              <div className="catalog-only-body">
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>

              <footer className="catalog-only-meta">
                <small>Cod. {benefit.id.slice(0, 8)}</small>
                <strong>{benefit.costCoins} moedas</strong>
              </footer>
            </motion.article>
          ))}
        </div>
      )}
    </section>
  )
}
