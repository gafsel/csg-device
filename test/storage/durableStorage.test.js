import { default as durableStorage } from '../../src/storage/durableStorage';

test('durable storage is valid', () => {
    const key = Math.random().toString();
    const value = Math.random().toString();

    expect(durableStorage.hasKey(key)).toBe(false);

    durableStorage.setItem(key, value);

    expect(durableStorage.hasKey(key)).toBe(true);

    expect(durableStorage.getItem(key)).toBe(value);

    durableStorage.removeItem(key);

    expect(durableStorage.hasKey(key)).toBe(false);
});
