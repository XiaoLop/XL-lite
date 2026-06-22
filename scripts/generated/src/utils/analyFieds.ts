import type { Field } from "../types/entity";

export function analyFieds(fieldStr: string) {
    if (!fieldStr.trim()) {
        return [];
    }

    const fields = fieldStr.split(',').filter((f) => f.trim());

    const fieldsList: Field[] = fields.map((field: string) => {
        const fieldArr = field.split(':').map((s) => s.trim());
        return {
            name: fieldArr[0] || '',
            type: fieldArr[1] || '',
            required: fieldArr[2] === 'true',
            default: fieldArr[3] || '',
            comment: fieldArr[4] || '',
        };
    });

    return fieldsList;
}