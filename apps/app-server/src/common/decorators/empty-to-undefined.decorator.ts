import { Transform } from 'class-transformer';

export function EmptyToUndefined() {
    return Transform(({ value }) => {
        if (value === '' || value === null || value === undefined)
            return undefined;
        return value as unknown;
    });
}
