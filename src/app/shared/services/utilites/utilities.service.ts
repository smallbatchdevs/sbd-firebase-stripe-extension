import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

}

export function objectExists(obj: any): boolean {
  return !!obj;
}

/** check if the object already exists in the array,
 * if it does then just replace the old obj with the new one, else add it to the array
 *
 * @param array
 * @param property - the property of the array elements to check against the value provided.
 * @param value
 * @param updatedObject - this object must have a unique uid property
 * @returns any[] - a new array with the specific value added or updated. (this is not the original array)
 */
export function addOrReplaceByProp(array, property, value, updatedObject): any[] {
  const newArray = array.slice();
  let index = -1;
  newArray.filter((element, position) => {
    if (byString(element, property) === value) {
      delete newArray[(index = position)];
    }
    return true;
  });
  // append to list or put in place
  if (index === -1) {
    newArray.push(updatedObject);
  } else {
    newArray[index] = updatedObject;
  }
  return newArray;
}

/** Removes a single object from a given array without affecting the original array reference
 *
 * @param {any[]} array
 * @param property
 * @param propertyValue
 * @returns {any[]} - a new array with the object corresponding to the given uid removed.
 (this is not the original array passed in)
 */
export function removeFromArrayByProp(array: any[], property: string, propertyValue: string): any[] {
  const newArray = array.slice();
  newArray.filter((element, position) => {
    if (byString(element, property) === propertyValue) {
      newArray.splice(position, 1);
    }
    return true;
  });
  return newArray;
}

/**
 * https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
 * @param o
 * @param s
 * @returns {any}
 */
export const byString = (o, s) => {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, ''); // strip a leading dot
  const a = s.split('.');
  for (let i = 0, n = a.length; i < n; ++i) {
    const k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
};
