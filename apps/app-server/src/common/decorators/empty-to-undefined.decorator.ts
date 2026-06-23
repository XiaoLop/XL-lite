import { Transform } from 'class-transformer';

export function EmptyToUndefined() {
    return Transform(({ value }) => {
        if (value === '' || value === null || value === undefined) {
            return undefined;
        }

        switch (value) {
            case 'true':
                return true;
            case 'false':
                return false;
        }
        return value as string;
    });
}
