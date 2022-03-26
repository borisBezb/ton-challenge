class Storage {
  save(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  load<T>(key: string, defaultValue: any): T {
    const value = localStorage.getItem(key);
    if (!value) {
      return defaultValue;
    }

    return JSON.parse(value);
  }
}

const storage = new Storage();

export default storage;
