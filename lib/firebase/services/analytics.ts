import { artworksService } from "./artworks";
import { performancesService } from "./performances";
import { commissionsService } from "./commissions";
import type { FinancialStats, Artwork } from "@/types";

export const analyticsService = {
  // Calculate comprehensive financial stats for an artist
  async getFinancialStats(
    artistId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<FinancialStats> {
    // Get all sold artworks
    const allArtworks = await artworksService.getByArtist(artistId);
    let soldArtworks = allArtworks.filter((a) => a.soldDate);

    // Filter by date range
    if (startDate) {
      soldArtworks = soldArtworks.filter(
        (a) => a.soldDate && a.soldDate >= startDate
      );
    }
    if (endDate) {
      soldArtworks = soldArtworks.filter(
        (a) => a.soldDate && a.soldDate <= endDate
      );
    }

    // Calculate sales income
    const salesIncome = soldArtworks.reduce((sum, a) => sum + a.price, 0);

    // Calculate commission income
    const commissions = await commissionsService.getByArtist(artistId);
    const completedCommissions = commissions.filter(
      (c) => c.status === "Completed"
    );
    const commissionIncome = completedCommissions.reduce(
      (sum, c) => sum + c.budget,
      0
    );

    // Calculate performance income
    const performanceStats = await performancesService.getStats(
      artistId,
      startDate,
      endDate
    );
    const performanceIncome = performanceStats.totalCash;

    // Total income
    const totalIncome = salesIncome + commissionIncome + performanceIncome;

    // Calculate price per hour (for artworks with time data)
    const artworksWithTime = soldArtworks.filter(
      (a) => a.timeSpent && a.timeSpent > 0
    );
    const totalTimeSpent = artworksWithTime.reduce(
      (sum, a) => sum + (a.timeSpent || 0),
      0
    );
    const pricePerHour =
      totalTimeSpent > 0
        ? Math.round(
            (artworksWithTime.reduce((sum, a) => sum + a.price, 0) /
              totalTimeSpent) *
              100
          ) / 100
        : undefined;

    // Calculate price per square meter (for artworks with dimensions)
    const artworksWithDimensions = soldArtworks.filter((a) => a.dimensions);
    const pricePerSqM = this.calculatePricePerSqM(artworksWithDimensions);

    // Calculate medium profitability
    const mediumProfitability = this.calculateMediumProfitability(soldArtworks);

    return {
      totalIncome,
      totalExpenses: 0, // Could be extended to track expenses
      netIncome: totalIncome,
      averagePrice:
        soldArtworks.length > 0
          ? Math.round((salesIncome / soldArtworks.length) * 100) / 100
          : 0,
      pricePerHour,
      pricePerSqM,
      mediumProfitability,
      performanceIncome,
      commissionIncome,
      salesIncome,
    };
  },

  // Calculate price per square meter
  calculatePricePerSqM(artworks: Artwork[]): number | undefined {
    const artworksWithArea = artworks.filter((a) => a.dimensions);

    if (artworksWithArea.length === 0) return undefined;

    let totalArea = 0;
    let totalPrice = 0;

    artworksWithArea.forEach((artwork) => {
      if (!artwork.dimensions) return;

      let area = artwork.dimensions.width * artwork.dimensions.height;

      // Convert to square meters
      if (artwork.dimensions.unit === "cm") {
        area = area / 10000;
      } else if (artwork.dimensions.unit === "ft") {
        area = area * 0.092903;
      }

      totalArea += area;
      totalPrice += artwork.price;
    });

    return totalArea > 0
      ? Math.round((totalPrice / totalArea) * 100) / 100
      : undefined;
  },

  // Calculate profitability by medium
  calculateMediumProfitability(artworks: Artwork[]) {
    const mediumStats: {
      [key: string]: {
        income: number;
        count: number;
        averagePrice: number;
      };
    } = {};

    artworks.forEach((artwork) => {
      if (!mediumStats[artwork.medium]) {
        mediumStats[artwork.medium] = {
          income: 0,
          count: 0,
          averagePrice: 0,
        };
      }

      mediumStats[artwork.medium].income += artwork.price;
      mediumStats[artwork.medium].count += 1;
    });

    // Calculate averages
    Object.keys(mediumStats).forEach((medium) => {
      mediumStats[medium].averagePrice =
        Math.round(
          (mediumStats[medium].income / mediumStats[medium].count) * 100
        ) / 100;
    });

    return mediumStats;
  },
};
