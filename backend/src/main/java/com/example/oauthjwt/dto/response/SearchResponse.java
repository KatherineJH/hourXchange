package com.example.oauthjwt.dto.response;

import java.util.List;

import lombok.Data;

@Data
public class SearchResponse<T> {
  private List<T> results;
  private long total;
  private int page;
  private int size;
  private int totalPages;

  public SearchResponse(List<T> results, long total, int page, int size) {
    this.results = results;
    this.total = total;
    this.page = page;
    this.size = size;
    this.totalPages = (int) Math.ceil((double) total / size);
  }
}
