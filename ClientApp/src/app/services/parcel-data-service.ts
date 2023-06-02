import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Item } from '../interfaces/item.interface';

@Injectable({
  providedIn: 'root'
})
export class ParcelDataService {
  private fileUrl = 'https://gist.githubusercontent.com/Lynne88git/552c061f4ebe867b70f6bc2376653b02/raw/876ca05861ce3bed421e0970b24563dfdfeb7ca5/input.txt';

  constructor(private http: HttpClient) { }

  fetchParcels(): Observable<string> {
    return this.http.get(this.fileUrl, { responseType: 'text' })
      .pipe(
        catchError(this.handleError),
        map(response => {
          // Split the response into individual lines
          const lines = response.trim().split('\n');

          // Process each line and extract weight limit and item list
          const result = lines.map(line => {
            const parts = line.split(':');
            const weightLimit = Number(parts[0].trim());
            const itemListString = parts[1].trim();
            const items = this.parseItemList(itemListString);
            const chosenItems = this.selectOptimalItems(weightLimit, items);
            const solution = this.generateSolutionString(chosenItems);
            return solution;
          });

          // Join the results with line breaks and return as a single string
          return result.join('\n');
        })
      );
  }

  private parseItemList(data: string): Item[] {
    // Use regular expressions to extract individual item details
    const pattern = /\((\d+),\s*(.*?),\s*([\d.]+),\s*€([\d.]+)\)/g;
    const matches = data.matchAll(pattern);

    // Process each match and create Item objects
    const items: Item[] = [];
    for (const match of matches) {
      const index = match[1];
      const name = match[2];
      const weight = Number(match[3]);
      const cost = Number(match[4]);
      const item: Item = { index, name, weight, cost };
      items.push(item);
    }

    return items;
  }

  private selectOptimalItems(weightLimit: number, items: Item[]): Item[] {
    const itemCount = items.length;
    const dp: number[][] = [];

    // Initialize the dynamic programming table created in Packer.cs
    for (let i = 0; i <= itemCount; i++) {
      dp[i] = [];
      for (let w = 0; w <= weightLimit; w++) {
        if (i === 0 || w === 0) {
          dp[i][w] = 0;
        } else if (items[i - 1].weight <= w) {
          const currentItem = items[i - 1];
          const cost = typeof currentItem.cost === 'number' ? currentItem.cost : parseFloat(currentItem.cost);
          dp[i][w] = Math.max(
            cost + dp[i - 1][Math.floor(w - items[i - 1].weight)],
            dp[i - 1][w]
          );
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    // Find the selected items by backtracking through the dynamic programming table
    const chosenItems: Item[] = [];
    let itemIndex = itemCount;
    let remainingWeight = weightLimit;

    while (itemIndex > 0 && remainingWeight > 0) {
      if (dp[itemIndex][Math.floor(remainingWeight)] !== dp[itemIndex - 1][Math.floor(remainingWeight)]) {
        const selectedItem = items[itemIndex - 1];
        chosenItems.push(selectedItem);
        remainingWeight -= selectedItem.weight;
      }

      itemIndex--;
    }

    chosenItems.reverse(); // Reverse the list to match the expected output order

    return chosenItems;
  }

  private generateSolutionString(chosenItems: Item[]): string {
    const itemIndices = chosenItems.map(item => item.index);
    return itemIndices.join(',');
  }

private handleError(error: any): Observable<never> {
  console.error('An error occurred:', error);
  return throwError('Something went wrong. Please try again later.') as Observable<never>;
}

}


