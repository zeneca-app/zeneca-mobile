import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import React from "react";

const ACFlag = require("@/assets/flags/ac.png");
const ADFlag = require("@/assets/flags/ad.png");
const AEFlag = require("@/assets/flags/ae.png");
const AFFlag = require("@/assets/flags/af.png");
const AGFlag = require("@/assets/flags/ag.png");
const AIFlag = require("@/assets/flags/ai.png");
const ALFlag = require("@/assets/flags/al.png");
const AMFlag = require("@/assets/flags/am.png");
const ANFlag = require("@/assets/flags/an.png");
const AOFlag = require("@/assets/flags/ao.png");
const AQFlag = require("@/assets/flags/aq.png");
const ARFlag = require("@/assets/flags/ar.png");
const ASFlag = require("@/assets/flags/as.png");
const ATFlag = require("@/assets/flags/at.png");
const AUFlag = require("@/assets/flags/au.png");
const AWFlag = require("@/assets/flags/aw.png");
const AXFlag = require("@/assets/flags/ax.png");
const AZFlag = require("@/assets/flags/az.png");
const BAFlag = require("@/assets/flags/ba.png");
const BBFlag = require("@/assets/flags/bb.png");
const BDFlag = require("@/assets/flags/bd.png");
const BEFlag = require("@/assets/flags/be.png");
const BFFlag = require("@/assets/flags/bf.png");
const BGFlag = require("@/assets/flags/bg.png");
const BHFlag = require("@/assets/flags/bh.png");
const BIFlag = require("@/assets/flags/bi.png");
const BJFlag = require("@/assets/flags/bj.png");
const BLFlag = require("@/assets/flags/bl.png");
const BMFlag = require("@/assets/flags/bm.png");
const BNFlag = require("@/assets/flags/bn.png");
const BOFlag = require("@/assets/flags/bo.png");
const BQFlag = require("@/assets/flags/bq.png");
const BRFlag = require("@/assets/flags/br.png");
const BSFlag = require("@/assets/flags/bs.png");
const BTFlag = require("@/assets/flags/bt.png");
const BVFlag = require("@/assets/flags/bv.png");
const BWFlag = require("@/assets/flags/bw.png");
const BYFlag = require("@/assets/flags/by.png");
const BZFlag = require("@/assets/flags/bz.png");
const CAFlag = require("@/assets/flags/ca.png");
const CCFlag = require("@/assets/flags/cc.png");
const CDFlag = require("@/assets/flags/cd.png");
const CFFlag = require("@/assets/flags/cf.png");
const CGFlag = require("@/assets/flags/cg.png");
const CHFlag = require("@/assets/flags/ch.png");
const CIFlag = require("@/assets/flags/ci.png");
const CKFlag = require("@/assets/flags/ck.png");
const CLFlag = require("@/assets/flags/cl.png");
const CMFlag = require("@/assets/flags/cm.png");
const CNFlag = require("@/assets/flags/cn.png");
const COFlag = require("@/assets/flags/co.png");
const CPFlag = require("@/assets/flags/cp.png");
const CQFlag = require("@/assets/flags/cq.png");
const CRFlag = require("@/assets/flags/cr.png");
const CUFlag = require("@/assets/flags/cu.png");
const CVFlag = require("@/assets/flags/cv.png");
const CWFlag = require("@/assets/flags/cw.png");
const CXFlag = require("@/assets/flags/cx.png");
const CYFlag = require("@/assets/flags/cy.png");
const CZFlag = require("@/assets/flags/cz.png");
const DEFlag = require("@/assets/flags/de.png");
const DGFlag = require("@/assets/flags/dg.png");
const DJFlag = require("@/assets/flags/dj.png");
const DKFlag = require("@/assets/flags/dk.png");
const DMFlag = require("@/assets/flags/dm.png");
const DOFlag = require("@/assets/flags/do.png");
const DZFlag = require("@/assets/flags/dz.png");
const EAFlag = require("@/assets/flags/ea.png");
const ECFlag = require("@/assets/flags/ec.png");
const EEFlag = require("@/assets/flags/ee.png");
const EGFlag = require("@/assets/flags/eg.png");
const EHFlag = require("@/assets/flags/eh.png");
const ERFlag = require("@/assets/flags/er.png");
const ESFlag = require("@/assets/flags/es.png");
const ETFlag = require("@/assets/flags/et.png");
const EUFlag = require("@/assets/flags/eu.png");
const EWFlag = require("@/assets/flags/ewe.png");
const FIFlag = require("@/assets/flags/fi.png");
const FJFlag = require("@/assets/flags/fj.png");
const FKFlag = require("@/assets/flags/fk.png");
const FMFlag = require("@/assets/flags/fm.png");
const FOFlag = require("@/assets/flags/fo.png");
const FRFlag = require("@/assets/flags/fr.png");
const FXFlag = require("@/assets/flags/fx.png");
const GAFlag = require("@/assets/flags/ga.png");
const GBFlag = require("@/assets/flags/gb.png");
const GDFlag = require("@/assets/flags/gd.png");
const GEFlag = require("@/assets/flags/ge.png");
const GFFlag = require("@/assets/flags/gf.png");
const GGFlag = require("@/assets/flags/gg.png");
const GHFlag = require("@/assets/flags/gh.png");
const GIFlag = require("@/assets/flags/gi.png");
const GLFlag = require("@/assets/flags/gl.png");
const GMFlag = require("@/assets/flags/gm.png");
const GNFlag = require("@/assets/flags/gn.png");
const GPFlag = require("@/assets/flags/gp.png");
const GQFlag = require("@/assets/flags/gq.png");
const GRFlag = require("@/assets/flags/gr.png");
const GSFlag = require("@/assets/flags/gs.png");
const GTFlag = require("@/assets/flags/gt.png");
const GUFlag = require("@/assets/flags/gu.png");
const GWFlag = require("@/assets/flags/gw.png");
const GYFlag = require("@/assets/flags/gy.png");
const HAFlag = require("@/assets/flags/hausa.png");
const HKFlag = require("@/assets/flags/hk.png");
const HMFlag = require("@/assets/flags/hm.png");
const HNFlag = require("@/assets/flags/hn.png");
const HRFlag = require("@/assets/flags/hr.png");
const HTFlag = require("@/assets/flags/ht.png");
const HUFlag = require("@/assets/flags/hu.png");
const ICFlag = require("@/assets/flags/ic.png");
const IDFlag = require("@/assets/flags/id.png");
const IEFlag = require("@/assets/flags/ie.png");
const ILFlag = require("@/assets/flags/il.png");
const IMFlag = require("@/assets/flags/im.png");
const INFlag = require("@/assets/flags/in.png");
const IOFlag = require("@/assets/flags/io.png");
const IQFlag = require("@/assets/flags/iq.png");
const IRFlag = require("@/assets/flags/ir.png");
const ISFlag = require("@/assets/flags/is.png");
const ITFlag = require("@/assets/flags/it.png");
const JEFlag = require("@/assets/flags/je.png");
const JMFlag = require("@/assets/flags/jm.png");
const JOFlag = require("@/assets/flags/jo.png");
const JPFlag = require("@/assets/flags/jp.png");
const KAFlag = require("@/assets/flags/kanuri.png");
const KEFlag = require("@/assets/flags/ke.png");
const KGFlag = require("@/assets/flags/kg.png");
const KHFlag = require("@/assets/flags/kh.png");
const KIFlag = require("@/assets/flags/ki.png");
const KMFlag = require("@/assets/flags/km.png");
const KNFlag = require("@/assets/flags/kn.png");
const KOFlag = require("@/assets/flags/kongo.png");
const KPFlag = require("@/assets/flags/kp.png");
const KRFlag = require("@/assets/flags/kr.png");
const KWFlag = require("@/assets/flags/kw.png");
const KYFlag = require("@/assets/flags/ky.png");
const KZFlag = require("@/assets/flags/kz.png");
const LAFlag = require("@/assets/flags/la.png");
const LBFlag = require("@/assets/flags/lb.png");
const LCFlag = require("@/assets/flags/lc.png");
const LIFlag = require("@/assets/flags/li.png");
const LKFlag = require("@/assets/flags/lk.png");
const LRFlag = require("@/assets/flags/lr.png");
const LSFlag = require("@/assets/flags/ls.png");
const LTFlag = require("@/assets/flags/lt.png");
const LUFlag = require("@/assets/flags/lu.png");
const LVFlag = require("@/assets/flags/lv.png");
const LYFlag = require("@/assets/flags/ly.png");
const MAFlag = require("@/assets/flags/ma.png");
const MCFlag = require("@/assets/flags/mc.png");
const MDFlag = require("@/assets/flags/md.png");
const MEFlag = require("@/assets/flags/me.png");
const MFFlag = require("@/assets/flags/mf.png");
const MGFlag = require("@/assets/flags/mg.png");
const MHFlag = require("@/assets/flags/mh.png");
const MKFlag = require("@/assets/flags/mk.png");
const MLFlag = require("@/assets/flags/ml.png");
const MMFlag = require("@/assets/flags/mm.png");
const MNFlag = require("@/assets/flags/mn.png");
const MOFlag = require("@/assets/flags/mo.png");
const MPFlag = require("@/assets/flags/mp.png");
const MQFlag = require("@/assets/flags/mq.png");
const MRFlag = require("@/assets/flags/mr.png");
const MSFlag = require("@/assets/flags/ms.png");
const MTFlag = require("@/assets/flags/mt.png");
const MUFlag = require("@/assets/flags/mu.png");
const MVFlag = require("@/assets/flags/mv.png");
const MWFlag = require("@/assets/flags/mw.png");
const MXFlag = require("@/assets/flags/mx.png");
const MYFlag = require("@/assets/flags/my.png");
const MZFlag = require("@/assets/flags/mz.png");
const NAFlag = require("@/assets/flags/na.png");
const NCFlag = require("@/assets/flags/nc.png");
const NEFlag = require("@/assets/flags/ne.png");
const NFFlag = require("@/assets/flags/nf.png");
const NGFlag = require("@/assets/flags/ng.png");
const NIFlag = require("@/assets/flags/ni.png");
const NLFlag = require("@/assets/flags/nl.png");
const NOFlag = require("@/assets/flags/no.png");
const NPFlag = require("@/assets/flags/np.png");
const NRFlag = require("@/assets/flags/nr.png");
const NUFlag = require("@/assets/flags/nu.png");
const NZFlag = require("@/assets/flags/nz.png");
const OMFlag = require("@/assets/flags/om.png");
const PAFlag = require("@/assets/flags/pa.png");
const PEFlag = require("@/assets/flags/pe.png");
const PFFlag = require("@/assets/flags/pf.png");
const PGFlag = require("@/assets/flags/pg.png");
const PHFlag = require("@/assets/flags/ph.png");
const PKFlag = require("@/assets/flags/pk.png");
const PLFlag = require("@/assets/flags/pl.png");
const PMFlag = require("@/assets/flags/pm.png");
const PNFlag = require("@/assets/flags/pn.png");
const PRFlag = require("@/assets/flags/pr.png");
const PSFlag = require("@/assets/flags/ps.png");
const PTFlag = require("@/assets/flags/pt.png");
const PWFlag = require("@/assets/flags/pw.png");
const PYFlag = require("@/assets/flags/py.png");
const QAFlag = require("@/assets/flags/qa.png");
const REFlag = require("@/assets/flags/re.png");
const ROFlag = require("@/assets/flags/ro.png");
const RSFlag = require("@/assets/flags/rs.png");
const RUFlag = require("@/assets/flags/ru.png");
const RWFlag = require("@/assets/flags/rw.png");
const SAFlag = require("@/assets/flags/sa.png");
const SBFlag = require("@/assets/flags/sb.png");
const SCFlag = require("@/assets/flags/sc.png");
const SDFlag = require("@/assets/flags/sd.png");
const SEFlag = require("@/assets/flags/se.png");
const SGFlag = require("@/assets/flags/sg.png");
const SHFlag = require("@/assets/flags/sh.png");
const SIFlag = require("@/assets/flags/si.png");
const SJFlag = require("@/assets/flags/sj.png");
const SKFlag = require("@/assets/flags/sk.png");
const SLFlag = require("@/assets/flags/sl.png");
const SMFlag = require("@/assets/flags/sm.png");
const SNFlag = require("@/assets/flags/sn.png");
const SOFlag = require("@/assets/flags/so.png");
const SRFlag = require("@/assets/flags/sr.png");
const SSFlag = require("@/assets/flags/ss.png");
const STFlag = require("@/assets/flags/st.png");
const SUFlag = require("@/assets/flags/su.png");
const SVFlag = require("@/assets/flags/sv.png");
const SXFlag = require("@/assets/flags/sx.png");
const SYFlag = require("@/assets/flags/sy.png");
const SZFlag = require("@/assets/flags/sz.png");
const TAFlag = require("@/assets/flags/ta.png");
const TCFlag = require("@/assets/flags/tc.png");
const TDFlag = require("@/assets/flags/td.png");
const TFFlag = require("@/assets/flags/tf.png");
const TGFlag = require("@/assets/flags/tg.png");
const THFlag = require("@/assets/flags/th.png");
const TIFlag = require("@/assets/flags/tibet.png");
const TJFlag = require("@/assets/flags/tj.png");
const TKFlag = require("@/assets/flags/tk.png");
const TLFlag = require("@/assets/flags/tl.png");
const TMFlag = require("@/assets/flags/tm.png");
const TNFlag = require("@/assets/flags/tn.png");
const TOFlag = require("@/assets/flags/to.png");
const TRFlag = require("@/assets/flags/tr.png");
const TTFlag = require("@/assets/flags/tt.png");
const TVFlag = require("@/assets/flags/tv.png");
const TWFlag = require("@/assets/flags/tw.png");
const TZFlag = require("@/assets/flags/tz.png");
const UAFlag = require("@/assets/flags/ua.png");
const UGFlag = require("@/assets/flags/ug.png");
const UKFlag = require("@/assets/flags/uk.png");
const UMFlag = require("@/assets/flags/um.png");
const UNFlag = require("@/assets/flags/un.png");
const USFlag = require("@/assets/flags/us.png");
const UYFlag = require("@/assets/flags/uy.png");
const UZFlag = require("@/assets/flags/uz.png");
const VAFlag = require("@/assets/flags/va.png");
const VCFlag = require("@/assets/flags/vc.png");
const VEFlag = require("@/assets/flags/ve.png");
const VGFlag = require("@/assets/flags/vg.png");
const VIFlag = require("@/assets/flags/vi.png");
const VNFlag = require("@/assets/flags/vn.png");
const VUFlag = require("@/assets/flags/vu.png");
const WFFlag = require("@/assets/flags/wf.png");
const WSFlag = require("@/assets/flags/ws.png");
const XKFlag = require("@/assets/flags/xk.png");
const XXFlag = require("@/assets/flags/xx.png");
const YEFlag = require("@/assets/flags/ye.png");
const YTFlag = require("@/assets/flags/yt.png");
const YUFlag = require("@/assets/flags/yu.png");
const ZAFlag = require("@/assets/flags/za.png");
const ZMFlag = require("@/assets/flags/zm.png");
const ZWFlag = require("@/assets/flags/zw.png");

const flags = {
  AC: ACFlag,
  AD: ADFlag,
  AE: AEFlag,
  AF: AFFlag,
  AG: AGFlag,
  AI: AIFlag,
  AL: ALFlag,
  AM: AMFlag,
  AN: ANFlag,
  AO: AOFlag,
  AQ: AQFlag,
  AR: ARFlag,
  AS: ASFlag,
  AT: ATFlag,
  AU: AUFlag,
  AW: AWFlag,
  AX: AXFlag,
  AZ: AZFlag,
  BA: BAFlag,
  BB: BBFlag,
  BD: BDFlag,
  BE: BEFlag,
  BF: BFFlag,
  BG: BGFlag,
  BH: BHFlag,
  BI: BIFlag,
  BJ: BJFlag,
  BL: BLFlag,
  BM: BMFlag,
  BN: BNFlag,
  BO: BOFlag,
  BQ: BQFlag,
  BR: BRFlag,
  BS: BSFlag,
  BT: BTFlag,
  BV: BVFlag,
  BW: BWFlag,
  BY: BYFlag,
  BZ: BZFlag,
  CA: CAFlag,
  CC: CCFlag,
  CD: CDFlag,
  CF: CFFlag,
  CG: CGFlag,
  CH: CHFlag,
  CI: CIFlag,
  CK: CKFlag,
  CL: CLFlag,
  CM: CMFlag,
  CN: CNFlag,
  CO: COFlag,
  CP: CPFlag,
  CQ: CQFlag,
  CR: CRFlag,
  CU: CUFlag,
  CV: CVFlag,
  CW: CWFlag,
  CX: CXFlag,
  CY: CYFlag,
  CZ: CZFlag,
  DE: DEFlag,
  DG: DGFlag,
  DJ: DJFlag,
  DK: DKFlag,
  DM: DMFlag,
  DO: DOFlag,
  DZ: DZFlag,
  EA: EAFlag,
  EC: ECFlag,
  EE: EEFlag,
  EG: EGFlag,
  EH: EHFlag,
  ER: ERFlag,
  ES: ESFlag,
  ET: ETFlag,
  EU: EUFlag,
  EW: EWFlag,
  FI: FIFlag,
  FJ: FJFlag,
  FK: FKFlag,
  FM: FMFlag,
  FO: FOFlag,
  FR: FRFlag,
  FX: FXFlag,
  GA: GAFlag,
  GB: GBFlag,
  GD: GDFlag,
  GE: GEFlag,
  GF: GFFlag,
  GG: GGFlag,
  GH: GHFlag,
  GI: GIFlag,
  GL: GLFlag,
  GM: GMFlag,
  GN: GNFlag,
  GP: GPFlag,
  GQ: GQFlag,
  GR: GRFlag,
  GS: GSFlag,
  GT: GTFlag,
  GU: GUFlag,
  GW: GWFlag,
  GY: GYFlag,
  HA: HAFlag,
  HK: HKFlag,
  HM: HMFlag,
  HN: HNFlag,
  HR: HRFlag,
  HT: HTFlag,
  HU: HUFlag,
  IC: ICFlag,
  ID: IDFlag,
  IE: IEFlag,
  IL: ILFlag,
  IM: IMFlag,
  IN: INFlag,
  IO: IOFlag,
  IQ: IQFlag,
  IR: IRFlag,
  IS: ISFlag,
  IT: ITFlag,
  JE: JEFlag,
  JM: JMFlag,
  JO: JOFlag,
  JP: JPFlag,
  KA: KAFlag,
  KE: KEFlag,
  KG: KGFlag,
  KH: KHFlag,
  KI: KIFlag,
  KM: KMFlag,
  KN: KNFlag,
  KO: KOFlag,
  KP: KPFlag,
  KR: KRFlag,
  KW: KWFlag,
  KY: KYFlag,
  KZ: KZFlag,
  LA: LAFlag,
  LB: LBFlag,
  LC: LCFlag,
  LI: LIFlag,
  LK: LKFlag,
  LR: LRFlag,
  LS: LSFlag,
  LT: LTFlag,
  LU: LUFlag,
  LV: LVFlag,
  LY: LYFlag,
  MA: MAFlag,
  MC: MCFlag,
  MD: MDFlag,
  ME: MEFlag,
  MF: MFFlag,
  MG: MGFlag,
  MH: MHFlag,
  MK: MKFlag,
  ML: MLFlag,
  MM: MMFlag,
  MN: MNFlag,
  MO: MOFlag,
  MP: MPFlag,
  MQ: MQFlag,
  MR: MRFlag,
  MS: MSFlag,
  MT: MTFlag,
  MU: MUFlag,
  MV: MVFlag,
  MW: MWFlag,
  MX: MXFlag,
  MY: MYFlag,
  MZ: MZFlag,
  NA: NAFlag,
  NC: NCFlag,
  NE: NEFlag,
  NF: NFFlag,
  NG: NGFlag,
  NI: NIFlag,
  NL: NLFlag,
  NO: NOFlag,
  NP: NPFlag,
  NR: NRFlag,
  NU: NUFlag,
  NZ: NZFlag,
  OM: OMFlag,
  PA: PAFlag,
  PE: PEFlag,
  PF: PFFlag,
  PG: PGFlag,
  PH: PHFlag,
  PK: PKFlag,
  PL: PLFlag,
  PM: PMFlag,
  PN: PNFlag,
  PR: PRFlag,
  PS: PSFlag,
  PT: PTFlag,
  PW: PWFlag,
  PY: PYFlag,
  QA: QAFlag,
  RE: REFlag,
  RO: ROFlag,
  RS: RSFlag,
  RU: RUFlag,
  RW: RWFlag,
  SA: SAFlag,
  SB: SBFlag,
  SC: SCFlag,
  SD: SDFlag,
  SE: SEFlag,
  SG: SGFlag,
  SH: SHFlag,
  SI: SIFlag,
  SJ: SJFlag,
  SK: SKFlag,
  SL: SLFlag,
  SM: SMFlag,
  SN: SNFlag,
  SO: SOFlag,
  SR: SRFlag,
  SS: SSFlag,
  ST: STFlag,
  SU: SUFlag,
  SV: SVFlag,
  SX: SXFlag,
  SY: SYFlag,
  SZ: SZFlag,
  TA: TAFlag,
  TC: TCFlag,
  TD: TDFlag,
  TF: TFFlag,
  TG: TGFlag,
  TH: THFlag,
  TI: TIFlag,
  TJ: TJFlag,
  TK: TKFlag,
  TL: TLFlag,
  TM: TMFlag,
  TN: TNFlag,
  TO: TOFlag,
  TR: TRFlag,
  TT: TTFlag,
  TV: TVFlag,
  TW: TWFlag,
  TZ: TZFlag,
  UA: UAFlag,
  UG: UGFlag,
  UK: UKFlag,
  UM: UMFlag,
  UN: UNFlag,
  US: USFlag,
  UY: UYFlag,
  UZ: UZFlag,
  VA: VAFlag,
  VC: VCFlag,
  VE: VEFlag,
  VG: VGFlag,
  VI: VIFlag,
  VN: VNFlag,
  VU: VUFlag,
  WF: WFFlag,
  WS: WSFlag,
  XK: XKFlag,
  XX: XXFlag,
  YE: YEFlag,
  YT: YTFlag,
  YU: YUFlag,
  ZA: ZAFlag,
  ZM: ZMFlag,
  ZW: ZWFlag,
};

cssInterop(Image, {
  className: "style",
});

const Flag = ({ code, className = "" }) => {
  const flag = flags[code];
  return <Image source={flag} className={className} />;
};
export default Flag;
