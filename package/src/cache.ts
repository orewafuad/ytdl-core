import { setTimeout } from 'timers';

// A cache that expires.
export class Cache extends Map {
    private timeout: number;

    constructor(timeout = 1000) {
        super();
        this.timeout = timeout;
    }

    set(key: any, value: any): this {
        if (this.has(key)) {
            clearTimeout(super.get(key).tid);
        }

        super.set(key, {
            tid: setTimeout(this.delete.bind(this, key), this.timeout).unref(),
            value,
        });

        return this;
    }

    get<T = unknown>(key: string): T | null {
        const ENTRY = super.get(key);
        if (ENTRY) {
            return ENTRY.value;
        }

        return null;
    }

    getOrSet<T = unknown>(key: string, fn: () => any): T | null {
        if (this.has(key)) {
            return this.get<T>(key);
        } else {
            let value = fn();
            this.set(key, value);

            (async () => {
                try {
                    await value;
                } catch (err) {
                    this.delete(key);
                }
            })();

            return value;
        }
    }

    delete(key: any): boolean {
        let ENTRY = super.get(key);

        if (ENTRY) {
            clearTimeout(ENTRY.tid);
            return super.delete(key);
        }

        return false;
    }

    clear() {
        for (const ENTRY of this.values()) {
            clearTimeout(ENTRY.tid);
        }

        super.clear();
    }
}
