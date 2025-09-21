// Date formatting utilities
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "Not set";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid date";
  }
};

export const formatRelativeTime = (
  dateString: string | null | undefined,
): string => {
  if (!dateString) return "Not set";

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  } catch {
    return "Invalid date";
  }
};

export const isDateInFuture = (
  dateString: string | null | undefined,
): boolean => {
  if (!dateString) return false;

  try {
    const date = new Date(dateString);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date > now;
  } catch {
    return false;
  }
};

export const isDateToday = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false;

  try {
    const date = new Date(dateString);
    const now = new Date();

    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  } catch {
    return false;
  }
};

// Validation utilities
export const validateProblemNumber = (value: string): string | null => {
  if (!value.trim()) return "Problem number is required";

  const num = parseInt(value.trim());
  if (isNaN(num) || num <= 0)
    return "Problem number must be a positive integer";
  if (num > 10000) return "Problem number seems unusually high";

  return null;
};

export const validateTitle = (value: string): string | null => {
  if (!value.trim()) return "Title is required";
  if (value.trim().length < 3)
    return "Title must be at least 3 characters long";
  if (value.length > 200) return "Title must be less than 200 characters";

  return null;
};

export const validatePattern = (value: string): string | null => {
  if (!value.trim()) return "Pattern is required";
  if (value.trim().length < 2)
    return "Pattern must be at least 2 characters long";
  if (value.length > 100) return "Pattern must be less than 100 characters";

  return null;
};

export const validateNotes = (value: string): string | null => {
  if (value.length > 1000) return "Notes must be less than 1000 characters";

  return null;
};

// Statistics utilities
export const calculateMasteryRate = (
  totalProblems: number,
  masteredCount: number,
): number => {
  if (totalProblems === 0) return 0;
  return Math.round((masteredCount / totalProblems) * 100);
};

// Local storage utilities
export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to remove from localStorage:", error);
  }
};

// Debounce utility for search inputs
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// URL utilities
export const getLeetCodeUrl = (problemNumber: number): string => {
  return `https://leetcode.com/problems/${problemNumber}/`;
};

// Export utilities
export const downloadAsJSON = (data: any, filename: string): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

