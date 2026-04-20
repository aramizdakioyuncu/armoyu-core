import { PollResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Polls (Anketler) related API responses.
 * Strict mapping: Targeting exact legacy fields for V1.
 */
export class PollMapper extends BaseMapper {
  static mapPoll(raw: any): PollResponse {
    const legacy = this.shouldReturnRaw<PollResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return {} as PollResponse;

    return {
      id: this.toNumber(raw.survey_ID),
      question: raw.survey_question,
      description: raw.survey_description || '',
      type: raw.survey_type,
      status: this.toNumber(raw.survey_status),
      endDate: raw.survey_enddate,
      totalVotes: this.toNumber(raw.survey_votingCount),
      isVoted: this.toBool(raw.survey_didIVote),
      selectedOptionId: this.toNumber(raw.survey_selectedOption),
      votingPercentage: raw.survey_votingPercentage,
      options: Array.isArray(raw.survey_options) ? raw.survey_options.map((opt: any) => ({
        id: this.toNumber(opt.option_ID),
        answer: opt.option_answer,
        votingPercentage: opt.option_votingPercentage
      })) : [],
      owner: raw.survey_owner ? {
        id: this.toNumber(raw.survey_owner.owner_ID),
        displayName: raw.survey_owner.owner_displayname,
        avatar: this.toImageUrl(raw.survey_owner.owner_avatar)
      } : undefined,
      images: Array.isArray(raw.survey_media) ? raw.survey_media.map((media: any) => ({
        id: this.toNumber(media.media_ID),
        url: this.toImageUrl(media.media_URL),
        thumbnail: this.toImageUrl(media.media_minURL)
      })) : []
    };
  }

  static mapPollList(rawList: any[]): PollResponse[] {
    return (rawList || []).map(item => this.mapPoll(item));
  }
}
