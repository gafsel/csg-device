import { default as sessionStorage } from './sessionStorage';

test('session storage is valid', () => {
    const key = Math.random().toString();
    const value = Math.random().toString();

    expect(sessionStorage.hasKey(key)).toBe(false);

    sessionStorage.setItem(key, value);

    expect(sessionStorage.hasKey(key)).toBe(true);

    expect(sessionStorage.getItem(key)).toBe(value);

    sessionStorage.removeItem(key);

    expect(sessionStorage.hasKey(key)).toBe(false);
});


test('session serialization storage is valid', () => {
    const key = Math.random().toString();
    const value = {
        prop: Math.random().toString(),
    };

    expect(sessionStorage.hasKey(key)).toBe(false);

    sessionStorage.setSerializableItem(key, value);

    expect(sessionStorage.hasKey(key)).toBe(true);

    const found = sessionStorage.getSerializableItem(key);

    expect(typeof found).toBe('object');

    expect(found.prop).toBeDefined();

    expect(found.prop).toBe(value.prop);

    sessionStorage.removeItem(key);

    expect(sessionStorage.hasKey(key)).toBe(false);
});
