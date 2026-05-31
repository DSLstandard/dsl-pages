/**
 * Each dot gets a color code for visualization.
 * 
 * The color palette is inspired by resistance color codes.
 * 
 * Resistance color's numeric value matches the number of dots in the Braille cell.
 * 
 * Resistance colors:
 * - Black: 0 (UNUSED)
 * - Brown: 1
 * - Red: 2
 * - Orange: 3
 * - Yellow: 4
 * - Green: 5
 * - Blue: 6
 * - Violet: 7
 * - Gray: 8
 * - White: 9 (UNUSED)
 */
export const CELL_ID_TO_CSS_COLOR: Record<number, string> = {
  1: "brown", 2: "red", 3: "orange", 4: "gold", 5: "green", 6: "blue", 7: "violet", 8: "gray",
}