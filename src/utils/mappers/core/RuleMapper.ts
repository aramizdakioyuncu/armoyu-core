import { RuleResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Platform Rules and Regulations.
 * Version-aware structure: Entry point delegates to specific version mappers.
 */
export class RuleMapper extends BaseMapper {
  static mapRule(raw: any, usePrevious: boolean = false): RuleResponse {
    const legacy = this.shouldReturnRaw<RuleResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return {} as RuleResponse;

    return this.mapRuleV1(raw);
  }

  // --- VERSION 1 ---

  private static mapRuleV1(raw: any): RuleResponse {
    return {
      id: this.toNumber(raw.maddeID),
      title: raw.maddebaslik,
      content: raw.maddeicerik,
      order: this.toNumber(raw.maddesira)
    };
  }

  static mapRuleList(rawList: any[], usePrevious: boolean = false): RuleResponse[] {
    return (rawList || []).map(item => this.mapRule(item, usePrevious));
  }

  // --- VERSION 2 ---
  private static mapRuleV2(raw: any): RuleResponse {
    return this.mapRuleV1(raw);
  }
}
