export class RankedUser {
  oyuncuID?: number | string;
  oyuncuadsoyad?: string;
  oyuncukullaniciadi?: string;
  oyuncuavatar?: string;
  oyuncuseviye?: number | string;
  oyuncuseviyexp?: number | string;
  oyuncuseviyesezonlukxp?: number | string;
  oyuncupop?: number | string;

  constructor(data?: Partial<RankedUser>) {
    Object.assign(this, data);
  }
}
