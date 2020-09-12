import { HTMLAttributes } from 'react'
import { stylesheet, classes } from 'typestyle'
import { sizes, styles, colors, palette } from '../../common/theme'
import React from 'react'

export function TileButton({ className, active, ...restProps }: Props) {
  return <button
    className={classes(css.squareButton, active && css.active, className)}
    {...restProps}
  />
}

type Props = HTMLAttributes<HTMLButtonElement> & {
  active?: boolean
}

const css = stylesheet({
  squareButton: {
    ...styles.control,
    borderWidth: 1,
    backgroundColor: colors.getControlBackground({ active: false, hover: false }),
    borderColor: colors.getControlBorder({ active: false, hover: false }),
    color: colors.darkest,
    borderRadius: 3,
    width: sizes.clickTarget,
    height: sizes.clickTarget,
    cursor: 'pointer',
    '$nest': {
      '&:hover': {
        backgroundColor: colors.getControlBackground({ active: false, hover: true })
      }
    }
  },
  active: {
    backgroundColor: colors.getControlBackground({ active: true, hover: false }),
    borderColor: colors.getControlBorder({ active: true, hover: false }),
    cursor: 'pointer',
    '$nest': {
      '&:hover': {
        backgroundColor: colors.getControlBackground({ active: true, hover: true })
      }
    }
  }
})