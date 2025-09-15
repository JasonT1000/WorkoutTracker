/**
 * A mapping of muscle group keys to their corresponding string identifiers.
 * Each key represents a muscle group, and the value is an array of string IDs
 * associated with that group for use in muscle visualization or selection.
 */
const muscleMap: Record<string, string[]> = {
    traps: ['traps_f_left', 'traps_f_right', 'traps_b_left', 'traps_b_right'],
    chestTop: ['chest_top_f_left', 'chest_top_f_right'],
    chestMain: ['chest_main_f_left', 'chest_main_f_right'],
    deltoidFront: ['deltoid_front_f_left', 'deltoid_front_f_right'],
    deltoidSide: ['deltoid_side_f_left', 'deltoid_side_f_right'],
    deltoidBack: ['chest_main_f_left', 'chest_main_f_right', 'deltoid_back_b_left', 'deltoid_back_b_right'],
    teresmajor: ['teresmajor_b_left', 'teresmajor_b_right'],
    teresminor: ['teresminor_b_left', 'teresminor_b_right'],
    infraspinatus: ['infraspinatus_b_left', 'infraspinatus_b_right'],
    biceps: ['bicep_f_left', 'bicep_f_right', 'bicep_b_left', 'bicep_b_right'],
    brachialis: ['tricep_f_left', 'tricep_f_right', 'tricep_b_left', 'tricep_b_right'],
    triceps: ['tricep_f_left', 'tricep_f_right', 'tricep_b_left', 'tricep_b_right'],
    forearms: ['forearm_f_left', 'forearm_f_right', 'forearm_b_left', 'forearm_b_right'],
    abs: ['abs_f_a', 'abs_f_b', 'abs_f_c', 'abs_f_d', 'abs_f_e', 'abs_f_f', 'abs_f_g', 'abs_f_h'],
    absObliques: ['abs_oblique_f_left', 'abs_oblique_f_right', 'abs_oblique_b_left', 'abs_oblique_b_right'],
    lats: ['lats_f_left', 'lats_f_right', 'lats_b_left', 'lats_b_right'],
    lowerback: ['lowerback_b_'],
    hamstrings: ['hamstrings_b_left', 'hamstrings_b_right'],
    glutes: ['glutes_b_'],
    adductor: ['adductor_f_left', 'adductor_f_right', 'adductor_b_left', 'adductor_b_right'],
    quads: ['quads_f_left', 'quads_f_right', 'quads_b_left', 'quads_b_right'],
    calfs: ['calf_f_left_a', 'calf_f_left_b', 'calf_f_right_a', 'calf_f_right_b', 'calf_b_left', 'calf_b_right'],
};

/**
 * Retrieves the array of string identifiers mapped to a given muscle group key.
 * If the key does not exist in the map, returns an empty array.
 *
 * @param key - The muscle group key to look up.
 * @returns An array of string identifiers for the specified muscle group, or an empty array if not found.
 */
export const getMappedValues = (key: string): string[] => {
    return muscleMap[key] || [];
};

// Example condition: only keep values that include 'f' (front)
/**
 * Returns filtered muscle map values for a given key and condition.
 * @param key The muscle group key.
 * @param condition A filter function for the mapped values.
 * @returns Filtered array of muscle map values.
 * 
 * @example
 * ```typescript
 * const frontFacingTriceps = getFilteredValues('triceps', (v) => v.includes('_f_'));
 * console.log(frontFacingTriceps); // ['tricep_f_left', 'tricep_f_right']
 * ```
 */
export const getFilteredValues = (key: string, condition: (value: string) => boolean): string[] => {
    const mapped = muscleMap[key] || [];
    return mapped.filter(condition);
};