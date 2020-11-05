import { hash, ValueObject } from 'immutable'
import { atLeast } from '../numbers'

export class GridPosition implements ValueObject {

  constructor(
    public readonly column: number,
    public readonly row: number
  ) {
  }

  static fromString(serialized: string) {
    if (!serialized) {
      return GridPosition.Null
    }
    const trimmed = serialized.replaceAll(/(\[|\])/, '')
    const split = trimmed.split(',')
    if (split.length !== 2) {
      return GridPosition.Null
    }
    return new GridPosition(Number(split[0]), Number(split[1]))
  }

  // union(other: GridPosition) {
  //   if (other.row === NaN || other.column === NaN) {
  //     return this
  //   }

  //   if (this.row === NaN || this.column === NaN) {
  //     return other
  //   }

  //   return new GridPosition(
  //     Math.max(this.column, other.column),
  //     Math.max(this.row, other.row)
  //   )
  // }

  get isNull() {
    return isNaN(this.column) || isNaN(this.row)
  }

  min(other: GridPosition) {
    if (other.isNull) return this
    if (this.isNull) return other
    return new GridPosition(
      Math.min(this.column, other.column),
      Math.min(this.row, other.row)
    )
  }

  max(other: GridPosition) {
    if (other.isNull) return this
    if (this.isNull) return other
    return new GridPosition(
      Math.max(this.column, other.column),
      Math.max(this.row, other.row)
    )
  }

  offsetX(x: number) {
    return new GridPosition(this.column, this.row + x)
  }

  offsetY(y: number) {
    return new GridPosition(this.column + y, this.row)
  }

  plus(offset: GridPosition) {
    return new GridPosition(this.column + offset.column, this.row + offset.row)
  }

  minus(offset: GridPosition) {
    return new GridPosition(this.column - offset.column, this.row - offset.row)
  }

  equals(other: GridPosition) {
    return other === this ||
      (other.column === this.column && other.row === this.row)
  }

  hashCode() {
    return hash([this.column, this.row])
  }

  toString() {
    return `${this.column},${this.row}`
  }

  static Zero = Object.freeze(new GridPosition(0, 0))
  static Null = Object.freeze(new GridPosition(NaN, NaN))
}