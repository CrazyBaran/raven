import { Column, Entity, PrimaryColumn } from 'typeorm';
import { DWH_V1_SCHEMA } from '../data-warehouse.v1.const';

@Entity({
  name: DWH_V1_SCHEMA.views.companies.name,
  schema: DWH_V1_SCHEMA.schemaName,
})
export class CompanyEntity {
  // included
  @PrimaryColumn({ name: 'DealRoomCompanyID' })
  public companyId: number;

  // included
  @Column({ name: 'Name' })
  public name: string;

  // included
  @Column({ name: 'Domain' })
  public domain: string;

  // NOT included
  @Column({ name: 'Website' })
  public website: string;

  // included
  @Column({ name: 'Description' })
  public description: string;

  // included
  @Column({ name: 'Tagline' })
  public tagline: string;

  // included
  @Column({ name: 'Founded Year' })
  public foundedYear: number;

  // included
  @Column({ name: 'Specter Growth Stage' })
  public specterGrowthStage: string;

  // included
  @Column({ name: 'DealRoom Growth Stage' })
  public dealRoomGrowthStage: string;

  // included
  @Column({ name: 'Specter Industry' })
  public specterIndustry: string;

  // included
  @Column({ name: 'Specter Sub-Industry' })
  public specterSubIndustry: string;

  // included
  @Column({ name: 'Specter HQ Location' })
  public specterHqLocation: string;

  // included
  @Column({ name: 'Specter HQ Region' })
  public specterHqRegion: string;

  // included
  @Column({ name: 'Total Funding Amount (USD)' })
  public totalFundingAmount: number;

  // included
  @Column({ name: 'Last Funding Amount (USD)' })
  public lastFundingAmount: number;

  // included
  @Column({ name: 'Last Funding Date' })
  public lastFundingDate: Date;

  // included
  @Column({ name: 'Specter Last Funding Type' })
  public specterLastFundingType: string;

  // included
  // Suggestion: fill with DealRoom IDs instead or separate table
  @Column({ name: 'Specter Investors' })
  public specterInvestors: string;

  // included
  // Suggestion: fill with DealRoom IDs instead or separate table
  @Column({ name: 'Specter Founders' })
  public specterFounders: string;

  // included
  @Column({ name: 'Post Money Valuation (in USD)' })
  public postMoneyValuation: number;

  // Suggestion: remove this column
  // Duplicate to data from DealRoomFundingRounds
  @Column({ name: 'Number of Funding Rounds' })
  public numberOfFundingRounds: number;

  // Suggestion: remove this column
  // Duplicate to specterInvestors length
  @Column({ name: 'Number of Investors' })
  public numberOfInvestors: number;

  // included
  @Column({ name: 'Acquired By' })
  public acquiredBy: string;

  // included
  @Column({ name: 'Acquisition Date' })
  public acquisitionDate: Date;

  // included
  @Column({ name: 'Acquisition Price (in USD)' })
  public acquisitionPrice: number;

  @Column({ name: 'IPO Details' })
  public ipoDetails: string;

  @Column({ name: 'Company Size' })
  public companySize: string;

  @Column({ name: 'Web Visits' })
  public webVisits: string;

  @Column({ name: 'Top Country' })
  public topCountry: string;

  @Column({ name: 'Country Breakdown' })
  public countryBreakdown: string;

  @Column({ name: 'Traffic Sources' })
  public trafficSources: string;

  @Column({ name: 'Social Traffic Breakdown' })
  public socialTrafficBreakdown: string;

  @Column({ name: 'Organic Search Percentage' })
  public organicSearchPercentage: string;

  @Column({ name: 'Paid Search Percentage' })
  public paidSearchPercentage: string;

  @Column({ name: 'Bounce Rate' })
  public bounceRate: string;

  @Column({ name: 'Session Duration (s)' })
  public sessionDuration: string;

  @Column({ name: 'Pages per Visit' })
  public pagesPerVisit: string;

  @Column({ name: 'Similar Websites and Similarity' })
  public similarWebsitesAndSimilarity: string;

  @Column({ name: 'Website Popularity Rank' })
  public websitePopularityRank: string;

  @Column({ name: 'Number of Employees' })
  public numberOfEmployees: number;

  @Column({ name: 'DealRoom URL' })
  public dealRoomUrl: string;

  @Column({ name: 'AngelList URL' })
  public angelListUrl: string;

  @Column({ name: 'CrunchBase URL' })
  public crunchBaseUrl: string;

  @Column({ name: 'Facebook URL' })
  public facebookUrl: string;

  @Column({ name: 'Google URL' })
  public googleUrl: string;

  @Column({ name: 'LinkedIn URL' })
  public linkedInUrl: string;

  @Column({ name: 'LinkedIn Followers' })
  public linkedInFollowers: string;

  @Column({ name: 'Twitter URL' })
  public twitterUrl: string;

  @Column({ name: 'Twitter Followers' })
  public twitterFollowers: string;

  @Column({ name: 'Instagram URL' })
  public instagramUrl: string;

  @Column({ name: 'Instagram Followers' })
  public instagramFollowers: string;

  @Column({ name: 'Instagram Following' })
  public instagramFollowing: string;

  @Column({ name: 'Total App Downloads' })
  public totalAppDownloads: string;

  @Column({ name: 'iTunes URL' })
  public iTunesUrl: string;

  @Column({ name: 'iTunes App ID' })
  public iTunesAppId: string;

  @Column({ name: 'iTunes Rating' })
  public iTunesRating: string;

  @Column({ name: 'iTunes Reviews' })
  public iTunesReviews: string;

  @Column({ name: 'Google Play URL' })
  public googlePlayUrl: string;

  @Column({ name: 'Google Play App ID' })
  public googlePlayAppId: string;

  @Column({ name: 'Google Play Rating' })
  public googlePlayRating: string;

  @Column({ name: 'Google Play Reviews' })
  public googlePlayReviews: string;

  @Column({ name: 'Google Play Installs' })
  public googlePlayInstalls: string;

  @Column({ name: 'Number of Patents' })
  public numberOfPatents: number;

  @Column({ name: 'Number of Trademarks' })
  public numberOfTrademarks: number;

  @Column({ name: 'Specter Company Email' })
  public specterCompanyEmail: string;

  @Column({ name: 'Specter Company Phone Number' })
  public specterCompanyPhoneNumber: string;

  @Column({ name: 'DealRoom Client Focus' })
  public dealRoomClientFocus: string;

  @Column({ name: 'DealRoom Delivery Method' })
  public dealRoomDeliveryMethod: string;

  @Column({ name: 'Specter Rank' })
  public specterRank: number;

  @Column({ name: 'Specter Last Updated' })
  public specterLastUpdated: Date;

  @Column({ name: 'DealRoom Last Updated' })
  public dealRoomLastUpdated: Date;
}
