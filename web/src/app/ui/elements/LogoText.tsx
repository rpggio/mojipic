import { em, linearGradient } from 'csx'
import React, { PropsWithChildren } from 'react'
import { stylesheet } from 'typestyle'
import { colors, palette } from '../../services'

export function LogoText({ children }: Props) {
  return (
    <div>
      {children
        ?.toString()
        .split('')
        .map((letter, idx) => (
          <span key={idx} className={css.letter}>
            {letter}
          </span>
        ))}
    </div>
  )
}

type Props = PropsWithChildren<{}>

const css = stylesheet({
  letter: {
    display: 'inline-block',
    textAlign: 'center',
    width: em(1.1),
    height: em(1.1),
    margin: em(0.06),
    borderRadius: em(0.1),
    background: linearGradient(palette.chill.hex(), palette.chill.darken(3).hex()),
    color: 'white',
    fontFamily: `'Jaldi', sans-serif`,
    textTransform: 'uppercase',
    boxShadow: `0 0 2px ${colors.medium}, 0 2px 2px ${colors.medium}`,
  },
})
