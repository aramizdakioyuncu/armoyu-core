import { RuleResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

export class RuleMapper extends BaseMapper {
  static mapRuleV1(raw: any): RuleResponse {
    if (!raw) return {} as RuleResponse;
    return {
      id: this.toNumber(raw.maddeID),
      content: raw.maddeicerik || raw.maddebaslik || '',
      title: raw.maddebaslik,
      order: this.toNumber(raw.maddesira)
    };
  }

  static mapRuleV2(raw: any): RuleResponse {
    if (!raw) return {} as RuleResponse;
    return {
      id: this.toNumber(raw.rule_ID),
      content: raw.rule_content || '',
      penalty: raw.rule_penalty,
      penaltySeconds: this.toNumber(raw.rule_penalty_seconds),
      date: raw.rule_date,
      subRule: raw.rule_submadde ?? null
    };
  }

  static mapRule(raw: any): RuleResponse {
    if (!raw) return {} as RuleResponse;
    return raw.rule_ID !== undefined ? this.mapRuleV2(raw) : this.mapRuleV1(raw);
  }

  static mapRuleList(rawList: any[]): RuleResponse[] {
    return (rawList || []).map(item => this.mapRule(item));
  }
}
