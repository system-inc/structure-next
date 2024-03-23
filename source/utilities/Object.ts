export function flattenObject(object: any, parentKey = '', result: any = {}): any {
    for(const key in object) {
        if(object.hasOwnProperty(key)) {
            const newKey = parentKey ? `${parentKey}-${key}` : key;

            if(typeof object[key] === 'object' && object[key] !== null && !Array.isArray(object[key])) {
                flattenObject(object[key], newKey, result);
            }
            else {
                result[newKey] = object[key];
            }
        }
    }
    return result;
}
