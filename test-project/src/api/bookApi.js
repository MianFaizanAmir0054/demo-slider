// src/api/bookApi.js
import bookData from '../data/bookData';

// Simulate API delay
const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchBookData = async () => {
  await simulateDelay(1500); // Simulate network delay
  return bookData;
};

export const saveBookProgress = async (pageNumber) => {
  await simulateDelay(500);
  console.log(`Progress saved at page ${pageNumber}`);
  return { success: true, page: pageNumber };
};