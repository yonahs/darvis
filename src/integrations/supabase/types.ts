export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bsd_packages: {
        Row: {
          autoid: number
          bsd_refnumber: string | null
          courier_id: number | null
          last_modified: string | null
          masterboxes: number | null
          packages: number | null
          shipdate: string | null
          totalsalevalue: number | null
          weight: number | null
        }
        Insert: {
          autoid: number
          bsd_refnumber?: string | null
          courier_id?: number | null
          last_modified?: string | null
          masterboxes?: number | null
          packages?: number | null
          shipdate?: string | null
          totalsalevalue?: number | null
          weight?: number | null
        }
        Update: {
          autoid?: number
          bsd_refnumber?: string | null
          courier_id?: number | null
          last_modified?: string | null
          masterboxes?: number | null
          packages?: number | null
          shipdate?: string | null
          totalsalevalue?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bsd_packages_courier_id_fkey"
            columns: ["courier_id"]
            isOneToOne: false
            referencedRelation: "couriers"
            referencedColumns: ["courierid"]
          },
          {
            foreignKeyName: "fk_bsd_packages_courier"
            columns: ["courier_id"]
            isOneToOne: false
            referencedRelation: "couriers"
            referencedColumns: ["courierid"]
          },
        ]
      }
      clientrx: {
        Row: {
          americandr: number | null
          clientid: number | null
          dateuploaded: string | null
          directory: string | null
          id: number
          image: string | null
          info: string | null
          last_modified: string | null
        }
        Insert: {
          americandr?: number | null
          clientid?: number | null
          dateuploaded?: string | null
          directory?: string | null
          id: number
          image?: string | null
          info?: string | null
          last_modified?: string | null
        }
        Update: {
          americandr?: number | null
          clientid?: number | null
          dateuploaded?: string | null
          directory?: string | null
          id?: number
          image?: string | null
          info?: string | null
          last_modified?: string | null
        }
        Relationships: []
      }
      clientrxdetails: {
        Row: {
          drugdetailid: number | null
          drugid: number | null
          duration: string | null
          filled: number | null
          id: number
          last_modified: string | null
          qtypercycle: number | null
          refills: number | null
          rxdate: string | null
          rxid: number | null
          strength: string | null
          totalboxesallowed: number | null
          yarpadate: string | null
        }
        Insert: {
          drugdetailid?: number | null
          drugid?: number | null
          duration?: string | null
          filled?: number | null
          id: number
          last_modified?: string | null
          qtypercycle?: number | null
          refills?: number | null
          rxdate?: string | null
          rxid?: number | null
          strength?: string | null
          totalboxesallowed?: number | null
          yarpadate?: string | null
        }
        Update: {
          drugdetailid?: number | null
          drugid?: number | null
          duration?: string | null
          filled?: number | null
          id?: number
          last_modified?: string | null
          qtypercycle?: number | null
          refills?: number | null
          rxdate?: string | null
          rxid?: number | null
          strength?: string | null
          totalboxesallowed?: number | null
          yarpadate?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_clientrx"
            columns: ["rxid"]
            isOneToOne: false
            referencedRelation: "clientrx"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          active: boolean | null
          address: string | null
          address2: string | null
          allergies: string | null
          birthdate: string | null
          blacklist: boolean | null
          blacklistreason: string | null
          city: string | null
          clientid: number
          condition_anxiety: boolean | null
          condition_arthritis: boolean | null
          condition_cancer: boolean | null
          condition_chronic_pain: boolean | null
          condition_ed: boolean | null
          condition_fibromyalgia: boolean | null
          condition_glaucoma: boolean | null
          condition_hiv_aids: boolean | null
          condition_loss_of_apppetite: boolean | null
          condition_migraines: boolean | null
          condition_muscle_spasm: boolean | null
          condition_nausea: boolean | null
          condition_other: boolean | null
          condition_other_info: string | null
          condition_seizures: boolean | null
          condition_trouble_sleeping: boolean | null
          condition_weight_loss: boolean | null
          country: string | null
          createddate: string | null
          datetocall: string | null
          dayphone: string | null
          doctor: string | null
          doctorclinic: number | null
          donotcall: number | null
          donotemail: boolean | null
          drphone: string | null
          email: string | null
          external_client_number: string | null
          firstname: string | null
          gender: string | null
          gens_referral_id: string | null
          last_modified: string | null
          lastname: string | null
          medications: string | null
          mobile: string | null
          mycomedswoocommerceid: number | null
          personalid: string | null
          personalidisvalid: boolean | null
          personalidtype: string | null
          rdoallergies: boolean | null
          rdomedications: boolean | null
          sendreminder: boolean | null
          signaturewaived: boolean | null
          state: string | null
          ubacare_id: string | null
          websiteid: number | null
          wooivfuserid: number | null
          woorxforme: number | null
          woorzuserid: number | null
          woorzusername: string | null
          woouserid: number | null
          woousername: string | null
          zip: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          address2?: string | null
          allergies?: string | null
          birthdate?: string | null
          blacklist?: boolean | null
          blacklistreason?: string | null
          city?: string | null
          clientid: number
          condition_anxiety?: boolean | null
          condition_arthritis?: boolean | null
          condition_cancer?: boolean | null
          condition_chronic_pain?: boolean | null
          condition_ed?: boolean | null
          condition_fibromyalgia?: boolean | null
          condition_glaucoma?: boolean | null
          condition_hiv_aids?: boolean | null
          condition_loss_of_apppetite?: boolean | null
          condition_migraines?: boolean | null
          condition_muscle_spasm?: boolean | null
          condition_nausea?: boolean | null
          condition_other?: boolean | null
          condition_other_info?: string | null
          condition_seizures?: boolean | null
          condition_trouble_sleeping?: boolean | null
          condition_weight_loss?: boolean | null
          country?: string | null
          createddate?: string | null
          datetocall?: string | null
          dayphone?: string | null
          doctor?: string | null
          doctorclinic?: number | null
          donotcall?: number | null
          donotemail?: boolean | null
          drphone?: string | null
          email?: string | null
          external_client_number?: string | null
          firstname?: string | null
          gender?: string | null
          gens_referral_id?: string | null
          last_modified?: string | null
          lastname?: string | null
          medications?: string | null
          mobile?: string | null
          mycomedswoocommerceid?: number | null
          personalid?: string | null
          personalidisvalid?: boolean | null
          personalidtype?: string | null
          rdoallergies?: boolean | null
          rdomedications?: boolean | null
          sendreminder?: boolean | null
          signaturewaived?: boolean | null
          state?: string | null
          ubacare_id?: string | null
          websiteid?: number | null
          wooivfuserid?: number | null
          woorxforme?: number | null
          woorzuserid?: number | null
          woorzusername?: string | null
          woouserid?: number | null
          woousername?: string | null
          zip?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          address2?: string | null
          allergies?: string | null
          birthdate?: string | null
          blacklist?: boolean | null
          blacklistreason?: string | null
          city?: string | null
          clientid?: number
          condition_anxiety?: boolean | null
          condition_arthritis?: boolean | null
          condition_cancer?: boolean | null
          condition_chronic_pain?: boolean | null
          condition_ed?: boolean | null
          condition_fibromyalgia?: boolean | null
          condition_glaucoma?: boolean | null
          condition_hiv_aids?: boolean | null
          condition_loss_of_apppetite?: boolean | null
          condition_migraines?: boolean | null
          condition_muscle_spasm?: boolean | null
          condition_nausea?: boolean | null
          condition_other?: boolean | null
          condition_other_info?: string | null
          condition_seizures?: boolean | null
          condition_trouble_sleeping?: boolean | null
          condition_weight_loss?: boolean | null
          country?: string | null
          createddate?: string | null
          datetocall?: string | null
          dayphone?: string | null
          doctor?: string | null
          doctorclinic?: number | null
          donotcall?: number | null
          donotemail?: boolean | null
          drphone?: string | null
          email?: string | null
          external_client_number?: string | null
          firstname?: string | null
          gender?: string | null
          gens_referral_id?: string | null
          last_modified?: string | null
          lastname?: string | null
          medications?: string | null
          mobile?: string | null
          mycomedswoocommerceid?: number | null
          personalid?: string | null
          personalidisvalid?: boolean | null
          personalidtype?: string | null
          rdoallergies?: boolean | null
          rdomedications?: boolean | null
          sendreminder?: boolean | null
          signaturewaived?: boolean | null
          state?: string | null
          ubacare_id?: string | null
          websiteid?: number | null
          wooivfuserid?: number | null
          woorxforme?: number | null
          woorzuserid?: number | null
          woorzusername?: string | null
          woouserid?: number | null
          woousername?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      couriers: {
        Row: {
          courierid: number
          displayname: string | null
          name: string | null
          trackinglink: string | null
        }
        Insert: {
          courierid: number
          displayname?: string | null
          name?: string | null
          trackinglink?: string | null
        }
        Update: {
          courierid?: number
          displayname?: string | null
          name?: string | null
          trackinglink?: string | null
        }
        Relationships: []
      }
      extratrackingnumbers: {
        Row: {
          autoid: number
          contents: string | null
          courierid: number | null
          last_modified: string | null
          orderid: number | null
          sentdate: string | null
          shipstatus: number | null
          ups: string | null
        }
        Insert: {
          autoid: number
          contents?: string | null
          courierid?: number | null
          last_modified?: string | null
          orderid?: number | null
          sentdate?: string | null
          shipstatus?: number | null
          ups?: string | null
        }
        Update: {
          autoid?: number
          contents?: string | null
          courierid?: number | null
          last_modified?: string | null
          orderid?: number | null
          sentdate?: string | null
          shipstatus?: number | null
          ups?: string | null
        }
        Relationships: []
      }
      foreign_clients: {
        Row: {
          active: boolean | null
          address: string | null
          address2: string | null
          affiliateid: number | null
          allergies: string | null
          birthdate: string | null
          blacklist: boolean | null
          blacklistreason: string | null
          city: string | null
          clientid: number | null
          condition_anxiety: boolean | null
          condition_arthritis: boolean | null
          condition_cancer: boolean | null
          condition_chronic_pain: boolean | null
          condition_ed: boolean | null
          condition_fibromyalgia: boolean | null
          condition_glaucoma: boolean | null
          condition_hiv_aids: boolean | null
          condition_loss_of_apppetite: boolean | null
          condition_migraines: boolean | null
          condition_muscle_spasm: boolean | null
          condition_nausea: boolean | null
          condition_other: boolean | null
          condition_other_info: string | null
          condition_seizures: boolean | null
          condition_trouble_sleeping: boolean | null
          condition_weight_loss: boolean | null
          country: string | null
          createddate: string | null
          datetocall: string | null
          dayphone: string | null
          doctor: string | null
          doctorclinic: number | null
          donotcall: number | null
          donotemail: boolean | null
          drclinic: string | null
          dremail: string | null
          drfax: string | null
          drphone: string | null
          email: string | null
          external_client_number: string | null
          firstname: string | null
          gender: string | null
          gens_referral_id: string | null
          guid: string | null
          hidethisshippingaddress: boolean | null
          israel365_freeshipping: boolean | null
          last_modified: string | null
          lastname: string | null
          medications: string | null
          mobile: string | null
          mycomedswoocommerceid: number | null
          origin: boolean | null
          password: string | null
          personalid: string | null
          personalidisvalid: boolean | null
          personalidtype: string | null
          promotion: boolean | null
          rdoallergies: boolean | null
          rdomedications: boolean | null
          referal: boolean | null
          referedby: string | null
          referedbyfriend: number | null
          referid: number | null
          sendreminder: boolean | null
          signaturewaived: boolean | null
          state: string | null
          suborigin: number | null
          ubacare_id: string | null
          username: string | null
          websiteid: number | null
          wooivfuserid: number | null
          woorxforme: number | null
          woorzuserid: number | null
          woorzusername: string | null
          woouserid: number | null
          woousername: string | null
          zip: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          address2?: string | null
          affiliateid?: number | null
          allergies?: string | null
          birthdate?: string | null
          blacklist?: boolean | null
          blacklistreason?: string | null
          city?: string | null
          clientid?: number | null
          condition_anxiety?: boolean | null
          condition_arthritis?: boolean | null
          condition_cancer?: boolean | null
          condition_chronic_pain?: boolean | null
          condition_ed?: boolean | null
          condition_fibromyalgia?: boolean | null
          condition_glaucoma?: boolean | null
          condition_hiv_aids?: boolean | null
          condition_loss_of_apppetite?: boolean | null
          condition_migraines?: boolean | null
          condition_muscle_spasm?: boolean | null
          condition_nausea?: boolean | null
          condition_other?: boolean | null
          condition_other_info?: string | null
          condition_seizures?: boolean | null
          condition_trouble_sleeping?: boolean | null
          condition_weight_loss?: boolean | null
          country?: string | null
          createddate?: string | null
          datetocall?: string | null
          dayphone?: string | null
          doctor?: string | null
          doctorclinic?: number | null
          donotcall?: number | null
          donotemail?: boolean | null
          drclinic?: string | null
          dremail?: string | null
          drfax?: string | null
          drphone?: string | null
          email?: string | null
          external_client_number?: string | null
          firstname?: string | null
          gender?: string | null
          gens_referral_id?: string | null
          guid?: string | null
          hidethisshippingaddress?: boolean | null
          israel365_freeshipping?: boolean | null
          last_modified?: string | null
          lastname?: string | null
          medications?: string | null
          mobile?: string | null
          mycomedswoocommerceid?: number | null
          origin?: boolean | null
          password?: string | null
          personalid?: string | null
          personalidisvalid?: boolean | null
          personalidtype?: string | null
          promotion?: boolean | null
          rdoallergies?: boolean | null
          rdomedications?: boolean | null
          referal?: boolean | null
          referedby?: string | null
          referedbyfriend?: number | null
          referid?: number | null
          sendreminder?: boolean | null
          signaturewaived?: boolean | null
          state?: string | null
          suborigin?: number | null
          ubacare_id?: string | null
          username?: string | null
          websiteid?: number | null
          wooivfuserid?: number | null
          woorxforme?: number | null
          woorzuserid?: number | null
          woorzusername?: string | null
          woouserid?: number | null
          woousername?: string | null
          zip?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          address2?: string | null
          affiliateid?: number | null
          allergies?: string | null
          birthdate?: string | null
          blacklist?: boolean | null
          blacklistreason?: string | null
          city?: string | null
          clientid?: number | null
          condition_anxiety?: boolean | null
          condition_arthritis?: boolean | null
          condition_cancer?: boolean | null
          condition_chronic_pain?: boolean | null
          condition_ed?: boolean | null
          condition_fibromyalgia?: boolean | null
          condition_glaucoma?: boolean | null
          condition_hiv_aids?: boolean | null
          condition_loss_of_apppetite?: boolean | null
          condition_migraines?: boolean | null
          condition_muscle_spasm?: boolean | null
          condition_nausea?: boolean | null
          condition_other?: boolean | null
          condition_other_info?: string | null
          condition_seizures?: boolean | null
          condition_trouble_sleeping?: boolean | null
          condition_weight_loss?: boolean | null
          country?: string | null
          createddate?: string | null
          datetocall?: string | null
          dayphone?: string | null
          doctor?: string | null
          doctorclinic?: number | null
          donotcall?: number | null
          donotemail?: boolean | null
          drclinic?: string | null
          dremail?: string | null
          drfax?: string | null
          drphone?: string | null
          email?: string | null
          external_client_number?: string | null
          firstname?: string | null
          gender?: string | null
          gens_referral_id?: string | null
          guid?: string | null
          hidethisshippingaddress?: boolean | null
          israel365_freeshipping?: boolean | null
          last_modified?: string | null
          lastname?: string | null
          medications?: string | null
          mobile?: string | null
          mycomedswoocommerceid?: number | null
          origin?: boolean | null
          password?: string | null
          personalid?: string | null
          personalidisvalid?: boolean | null
          personalidtype?: string | null
          promotion?: boolean | null
          rdoallergies?: boolean | null
          rdomedications?: boolean | null
          referal?: boolean | null
          referedby?: string | null
          referedbyfriend?: number | null
          referid?: number | null
          sendreminder?: boolean | null
          signaturewaived?: boolean | null
          state?: string | null
          suborigin?: number | null
          ubacare_id?: string | null
          username?: string | null
          websiteid?: number | null
          wooivfuserid?: number | null
          woorxforme?: number | null
          woorzuserid?: number | null
          woorzusername?: string | null
          woouserid?: number | null
          woousername?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      newdrugdetails: {
        Row: {
          aktive_id: string | null
          available: boolean | null
          barcode: number | null
          brand: boolean | null
          canada_cost_usd: number | null
          costnis: number | null
          defaultshipper: number | null
          drugid: number | null
          form: number | null
          id: number
          ivfwoo_id: number | null
          ivfwoo_parentid: number | null
          manufacturer: number | null
          nameil: string | null
          ok_capsule_sku: string | null
          onreekooz: boolean | null
          onrx4me: boolean | null
          otc: boolean | null
          packsize: number | null
          parkwayid: string | null
          reekooz_id: number | null
          reekooz_parentid: number | null
          rx4me_id: number | null
          rx4me_parentid: string | null
          saledollar: number | null
          salenis: number | null
          strength: string | null
          supplier: number | null
          turkey_cost_usd: number | null
          turkeycostprice: number | null
          ubacare_id: number | null
          weight: number | null
          woocommerceid: number | null
          woocommerceparentid: number | null
          yarpa: string | null
        }
        Insert: {
          aktive_id?: string | null
          available?: boolean | null
          barcode?: number | null
          brand?: boolean | null
          canada_cost_usd?: number | null
          costnis?: number | null
          defaultshipper?: number | null
          drugid?: number | null
          form?: number | null
          id: number
          ivfwoo_id?: number | null
          ivfwoo_parentid?: number | null
          manufacturer?: number | null
          nameil?: string | null
          ok_capsule_sku?: string | null
          onreekooz?: boolean | null
          onrx4me?: boolean | null
          otc?: boolean | null
          packsize?: number | null
          parkwayid?: string | null
          reekooz_id?: number | null
          reekooz_parentid?: number | null
          rx4me_id?: number | null
          rx4me_parentid?: string | null
          saledollar?: number | null
          salenis?: number | null
          strength?: string | null
          supplier?: number | null
          turkey_cost_usd?: number | null
          turkeycostprice?: number | null
          ubacare_id?: number | null
          weight?: number | null
          woocommerceid?: number | null
          woocommerceparentid?: number | null
          yarpa?: string | null
        }
        Update: {
          aktive_id?: string | null
          available?: boolean | null
          barcode?: number | null
          brand?: boolean | null
          canada_cost_usd?: number | null
          costnis?: number | null
          defaultshipper?: number | null
          drugid?: number | null
          form?: number | null
          id?: number
          ivfwoo_id?: number | null
          ivfwoo_parentid?: number | null
          manufacturer?: number | null
          nameil?: string | null
          ok_capsule_sku?: string | null
          onreekooz?: boolean | null
          onrx4me?: boolean | null
          otc?: boolean | null
          packsize?: number | null
          parkwayid?: string | null
          reekooz_id?: number | null
          reekooz_parentid?: number | null
          rx4me_id?: number | null
          rx4me_parentid?: string | null
          saledollar?: number | null
          salenis?: number | null
          strength?: string | null
          supplier?: number | null
          turkey_cost_usd?: number | null
          turkeycostprice?: number | null
          ubacare_id?: number | null
          weight?: number | null
          woocommerceid?: number | null
          woocommerceparentid?: number | null
          yarpa?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_newdrugdetails_drug"
            columns: ["drugid"]
            isOneToOne: false
            referencedRelation: "newdrugs"
            referencedColumns: ["drugid"]
          },
        ]
      }
      newdrugs: {
        Row: {
          availability: number | null
          chemical: string | null
          drugid: number
          ivf: boolean | null
          nameus: string | null
          onbothsites: boolean | null
          prescription: boolean | null
          refrigerate: boolean | null
          refrigeratedays: number | null
          visible: boolean | null
          woopostid: number | null
        }
        Insert: {
          availability?: number | null
          chemical?: string | null
          drugid: number
          ivf?: boolean | null
          nameus?: string | null
          onbothsites?: boolean | null
          prescription?: boolean | null
          refrigerate?: boolean | null
          refrigeratedays?: number | null
          visible?: boolean | null
          woopostid?: number | null
        }
        Update: {
          availability?: number | null
          chemical?: string | null
          drugid?: number
          ivf?: boolean | null
          nameus?: string | null
          onbothsites?: boolean | null
          prescription?: boolean | null
          refrigerate?: boolean | null
          refrigeratedays?: number | null
          visible?: boolean | null
          woopostid?: number | null
        }
        Relationships: []
      }
      ordercomments: {
        Row: {
          asanataskid: number | null
          author: string | null
          comment: string | null
          commentdate: string | null
          deleteable: boolean | null
          id: number
          last_modified: string | null
          orderid: number | null
          showonreadyshipping: boolean | null
        }
        Insert: {
          asanataskid?: number | null
          author?: string | null
          comment?: string | null
          commentdate?: string | null
          deleteable?: boolean | null
          id: number
          last_modified?: string | null
          orderid?: number | null
          showonreadyshipping?: boolean | null
        }
        Update: {
          asanataskid?: number | null
          author?: string | null
          comment?: string | null
          commentdate?: string | null
          deleteable?: boolean | null
          id?: number
          last_modified?: string | null
          orderid?: number | null
          showonreadyshipping?: boolean | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          achsubmitted: string | null
          addchargetoorder: number | null
          addchargetoorderreason: string | null
          address: string | null
          address2: string | null
          amount: number | null
          bsd_refnumber: string | null
          cancelled: boolean | null
          city: string | null
          clientid: number | null
          country: string | null
          courierid: number | null
          customshippingcost: number | null
          daysordered: number | null
          delaydate: string | null
          directions: string | null
          discount: number | null
          discountreason: string | null
          dispensingpharmacyorderid: number | null
          doctorsignbatchid: number | null
          drugdetailid: number | null
          drugid: number | null
          drugsordered: boolean | null
          exportedon: string | null
          express_shipping2: boolean | null
          express_shipping3: boolean | null
          external_order_number: string | null
          extracharges: number | null
          extrachargesdesc: string | null
          forceemsoverfedex: boolean | null
          id: number
          ilcost: number | null
          instock: boolean | null
          ip_woo_id: number | null
          ip_woo_line_item_id: number | null
          ip_woo_order_number: number | null
          ipiaddress: string | null
          last_modified: string | null
          nursing: boolean | null
          onhold: boolean | null
          onholddate: string | null
          onorder: boolean | null
          order_weight: number | null
          orderbilled: number | null
          orderdate: string | null
          orderid: number | null
          orderlockedforbilling: boolean | null
          outofstock: boolean | null
          packedby: string | null
          parkway_order_id: number | null
          pharmacyforlater: boolean | null
          pharmacylockedorder: string | null
          pharmacymarked: boolean | null
          pharmacypacked: boolean | null
          pharmacystatus: number | null
          pregnant: boolean | null
          printedemson: string | null
          printedinvoiceon: string | null
          problemorder: boolean | null
          processorid: number | null
          rate: number | null
          reekooz_woo_id: number | null
          reekooz_woo_order_number: number | null
          refill: boolean | null
          rushorder: boolean | null
          rxexported: boolean | null
          rxprinted: boolean | null
          sentdate: string | null
          settoturkey: boolean | null
          shippedby: string | null
          shipperid: number | null
          shippingcontents: string | null
          shippingcost_usd: number | null
          shippinglabelprinted: boolean | null
          shippingprice: number | null
          shipstatus: number | null
          sigdaily: number | null
          sigduration: number | null
          sigform: number | null
          sigfrequency: number | null
          sigmethod: number | null
          signature: boolean | null
          signedbydoctor: boolean | null
          sigqty: number | null
          sigroute: number | null
          state: string | null
          status: number | null
          totalcost: number | null
          totalcost_usd: number | null
          totalsale: number | null
          trackinglabellink: string | null
          turkeycostpricenis: number | null
          turkeycostpriceusd: number | null
          uba_shippingid: number | null
          ubacare_order_id: number | null
          uploadedtoturkey: boolean | null
          ups: string | null
          used_before: boolean | null
          usprice: number | null
          verifiedby: string | null
          wc_order_key: string | null
          websiteid: number | null
          zip: string | null
        }
        Insert: {
          achsubmitted?: string | null
          addchargetoorder?: number | null
          addchargetoorderreason?: string | null
          address?: string | null
          address2?: string | null
          amount?: number | null
          bsd_refnumber?: string | null
          cancelled?: boolean | null
          city?: string | null
          clientid?: number | null
          country?: string | null
          courierid?: number | null
          customshippingcost?: number | null
          daysordered?: number | null
          delaydate?: string | null
          directions?: string | null
          discount?: number | null
          discountreason?: string | null
          dispensingpharmacyorderid?: number | null
          doctorsignbatchid?: number | null
          drugdetailid?: number | null
          drugid?: number | null
          drugsordered?: boolean | null
          exportedon?: string | null
          express_shipping2?: boolean | null
          express_shipping3?: boolean | null
          external_order_number?: string | null
          extracharges?: number | null
          extrachargesdesc?: string | null
          forceemsoverfedex?: boolean | null
          id: number
          ilcost?: number | null
          instock?: boolean | null
          ip_woo_id?: number | null
          ip_woo_line_item_id?: number | null
          ip_woo_order_number?: number | null
          ipiaddress?: string | null
          last_modified?: string | null
          nursing?: boolean | null
          onhold?: boolean | null
          onholddate?: string | null
          onorder?: boolean | null
          order_weight?: number | null
          orderbilled?: number | null
          orderdate?: string | null
          orderid?: number | null
          orderlockedforbilling?: boolean | null
          outofstock?: boolean | null
          packedby?: string | null
          parkway_order_id?: number | null
          pharmacyforlater?: boolean | null
          pharmacylockedorder?: string | null
          pharmacymarked?: boolean | null
          pharmacypacked?: boolean | null
          pharmacystatus?: number | null
          pregnant?: boolean | null
          printedemson?: string | null
          printedinvoiceon?: string | null
          problemorder?: boolean | null
          processorid?: number | null
          rate?: number | null
          reekooz_woo_id?: number | null
          reekooz_woo_order_number?: number | null
          refill?: boolean | null
          rushorder?: boolean | null
          rxexported?: boolean | null
          rxprinted?: boolean | null
          sentdate?: string | null
          settoturkey?: boolean | null
          shippedby?: string | null
          shipperid?: number | null
          shippingcontents?: string | null
          shippingcost_usd?: number | null
          shippinglabelprinted?: boolean | null
          shippingprice?: number | null
          shipstatus?: number | null
          sigdaily?: number | null
          sigduration?: number | null
          sigform?: number | null
          sigfrequency?: number | null
          sigmethod?: number | null
          signature?: boolean | null
          signedbydoctor?: boolean | null
          sigqty?: number | null
          sigroute?: number | null
          state?: string | null
          status?: number | null
          totalcost?: number | null
          totalcost_usd?: number | null
          totalsale?: number | null
          trackinglabellink?: string | null
          turkeycostpricenis?: number | null
          turkeycostpriceusd?: number | null
          uba_shippingid?: number | null
          ubacare_order_id?: number | null
          uploadedtoturkey?: boolean | null
          ups?: string | null
          used_before?: boolean | null
          usprice?: number | null
          verifiedby?: string | null
          wc_order_key?: string | null
          websiteid?: number | null
          zip?: string | null
        }
        Update: {
          achsubmitted?: string | null
          addchargetoorder?: number | null
          addchargetoorderreason?: string | null
          address?: string | null
          address2?: string | null
          amount?: number | null
          bsd_refnumber?: string | null
          cancelled?: boolean | null
          city?: string | null
          clientid?: number | null
          country?: string | null
          courierid?: number | null
          customshippingcost?: number | null
          daysordered?: number | null
          delaydate?: string | null
          directions?: string | null
          discount?: number | null
          discountreason?: string | null
          dispensingpharmacyorderid?: number | null
          doctorsignbatchid?: number | null
          drugdetailid?: number | null
          drugid?: number | null
          drugsordered?: boolean | null
          exportedon?: string | null
          express_shipping2?: boolean | null
          express_shipping3?: boolean | null
          external_order_number?: string | null
          extracharges?: number | null
          extrachargesdesc?: string | null
          forceemsoverfedex?: boolean | null
          id?: number
          ilcost?: number | null
          instock?: boolean | null
          ip_woo_id?: number | null
          ip_woo_line_item_id?: number | null
          ip_woo_order_number?: number | null
          ipiaddress?: string | null
          last_modified?: string | null
          nursing?: boolean | null
          onhold?: boolean | null
          onholddate?: string | null
          onorder?: boolean | null
          order_weight?: number | null
          orderbilled?: number | null
          orderdate?: string | null
          orderid?: number | null
          orderlockedforbilling?: boolean | null
          outofstock?: boolean | null
          packedby?: string | null
          parkway_order_id?: number | null
          pharmacyforlater?: boolean | null
          pharmacylockedorder?: string | null
          pharmacymarked?: boolean | null
          pharmacypacked?: boolean | null
          pharmacystatus?: number | null
          pregnant?: boolean | null
          printedemson?: string | null
          printedinvoiceon?: string | null
          problemorder?: boolean | null
          processorid?: number | null
          rate?: number | null
          reekooz_woo_id?: number | null
          reekooz_woo_order_number?: number | null
          refill?: boolean | null
          rushorder?: boolean | null
          rxexported?: boolean | null
          rxprinted?: boolean | null
          sentdate?: string | null
          settoturkey?: boolean | null
          shippedby?: string | null
          shipperid?: number | null
          shippingcontents?: string | null
          shippingcost_usd?: number | null
          shippinglabelprinted?: boolean | null
          shippingprice?: number | null
          shipstatus?: number | null
          sigdaily?: number | null
          sigduration?: number | null
          sigform?: number | null
          sigfrequency?: number | null
          sigmethod?: number | null
          signature?: boolean | null
          signedbydoctor?: boolean | null
          sigqty?: number | null
          sigroute?: number | null
          state?: string | null
          status?: number | null
          totalcost?: number | null
          totalcost_usd?: number | null
          totalsale?: number | null
          trackinglabellink?: string | null
          turkeycostpricenis?: number | null
          turkeycostpriceusd?: number | null
          uba_shippingid?: number | null
          ubacare_order_id?: number | null
          uploadedtoturkey?: boolean | null
          ups?: string | null
          used_before?: boolean | null
          usprice?: number | null
          verifiedby?: string | null
          wc_order_key?: string | null
          websiteid?: number | null
          zip?: string | null
        }
        Relationships: []
      }
      pack_type: {
        Row: {
          id: number
          title: string | null
        }
        Insert: {
          id: number
          title?: string | null
        }
        Update: {
          id?: number
          title?: string | null
        }
        Relationships: []
      }
      processor: {
        Row: {
          abbrev: string | null
          active: boolean | null
          autoid: number
          displayname: string | null
          hasapi: boolean | null
          isacc: boolean | null
          location: string | null
          marker: string | null
          name: string | null
          showonivf: boolean | null
          sp_apilogin: string | null
          sp_apipublickey: string | null
          sp_developerid: string | null
          sp_mid: string | null
        }
        Insert: {
          abbrev?: string | null
          active?: boolean | null
          autoid: number
          displayname?: string | null
          hasapi?: boolean | null
          isacc?: boolean | null
          location?: string | null
          marker?: string | null
          name?: string | null
          showonivf?: boolean | null
          sp_apilogin?: string | null
          sp_apipublickey?: string | null
          sp_developerid?: string | null
          sp_mid?: string | null
        }
        Update: {
          abbrev?: string | null
          active?: boolean | null
          autoid?: number
          displayname?: string | null
          hasapi?: boolean | null
          isacc?: boolean | null
          location?: string | null
          marker?: string | null
          name?: string | null
          showonivf?: boolean | null
          sp_apilogin?: string | null
          sp_apipublickey?: string | null
          sp_developerid?: string | null
          sp_mid?: string | null
        }
        Relationships: []
      }
      shippers: {
        Row: {
          abbrev: string | null
          company_name: string | null
          contact_name: string | null
          country: string | null
          defaultcourier: number | null
          display_name: string | null
          email: string | null
          emailsforinvoices: string | null
          googlesheet: string | null
          isintl: boolean | null
          ivf: boolean | null
          shipperid: number
        }
        Insert: {
          abbrev?: string | null
          company_name?: string | null
          contact_name?: string | null
          country?: string | null
          defaultcourier?: number | null
          display_name?: string | null
          email?: string | null
          emailsforinvoices?: string | null
          googlesheet?: string | null
          isintl?: boolean | null
          ivf?: boolean | null
          shipperid: number
        }
        Update: {
          abbrev?: string | null
          company_name?: string | null
          contact_name?: string | null
          country?: string | null
          defaultcourier?: number | null
          display_name?: string | null
          email?: string | null
          emailsforinvoices?: string | null
          googlesheet?: string | null
          isintl?: boolean | null
          ivf?: boolean | null
          shipperid?: number
        }
        Relationships: []
      }
      shipwith: {
        Row: {
          autoid: number
          groupid: number | null
          last_modified: string | null
          orderid: number | null
        }
        Insert: {
          autoid: number
          groupid?: number | null
          last_modified?: string | null
          orderid?: number | null
        }
        Update: {
          autoid?: number
          groupid?: number | null
          last_modified?: string | null
          orderid?: number | null
        }
        Relationships: []
      }
      statuslist: {
        Row: {
          displaypriority: number | null
          goodtogo: boolean | null
          id: number
          ivf: boolean | null
          prioritize: number | null
          status: string | null
        }
        Insert: {
          displaypriority?: number | null
          goodtogo?: boolean | null
          id: number
          ivf?: boolean | null
          prioritize?: number | null
          status?: string | null
        }
        Update: {
          displaypriority?: number | null
          goodtogo?: boolean | null
          id?: number
          ivf?: boolean | null
          prioritize?: number | null
          status?: string | null
        }
        Relationships: []
      }
      stock_count_settings: {
        Row: {
          created_at: string | null
          email_frequency: string
          email_recipients: string[]
          id: string
          last_email_sent: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email_frequency?: string
          email_recipients?: string[]
          id?: string
          last_email_sent?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email_frequency?: string
          email_recipients?: string[]
          id?: string
          last_email_sent?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      stock_counts: {
        Row: {
          count: number
          created_at: string | null
          drug_id: number | null
          id: string
          last_updated: string | null
          updated_by: string | null
        }
        Insert: {
          count?: number
          created_at?: string | null
          drug_id?: number | null
          id?: string
          last_updated?: string | null
          updated_by?: string | null
        }
        Update: {
          count?: number
          created_at?: string | null
          drug_id?: number | null
          id?: string
          last_updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_counts_drug_id_fkey"
            columns: ["drug_id"]
            isOneToOne: false
            referencedRelation: "newdrugs"
            referencedColumns: ["drugid"]
          },
        ]
      }
      suppliers: {
        Row: {
          id: number
          name: string | null
          yarpacode: string | null
        }
        Insert: {
          id: number
          name?: string | null
          yarpacode?: string | null
        }
        Update: {
          id?: number
          name?: string | null
          yarpacode?: string | null
        }
        Relationships: []
      }
      trackingstatus: {
        Row: {
          id: number
          shipstatus: string | null
        }
        Insert: {
          id: number
          shipstatus?: string | null
        }
        Update: {
          id?: number
          shipstatus?: string | null
        }
        Relationships: []
      }
      websites: {
        Row: {
          abbrev: string | null
          address: string | null
          displayorder: number | null
          emailfrom: string | null
          fax: string | null
          invoiceimgemail: string | null
          invoiceimgfax: string | null
          invoiceimgtel: string | null
          invoicelogo: string | null
          loginlink: string | null
          name: string | null
          paths: string | null
          phone: string | null
          websiteid: number
        }
        Insert: {
          abbrev?: string | null
          address?: string | null
          displayorder?: number | null
          emailfrom?: string | null
          fax?: string | null
          invoiceimgemail?: string | null
          invoiceimgfax?: string | null
          invoiceimgtel?: string | null
          invoicelogo?: string | null
          loginlink?: string | null
          name?: string | null
          paths?: string | null
          phone?: string | null
          websiteid: number
        }
        Update: {
          abbrev?: string | null
          address?: string | null
          displayorder?: number | null
          emailfrom?: string | null
          fax?: string | null
          invoiceimgemail?: string | null
          invoiceimgfax?: string | null
          invoiceimgtel?: string | null
          invoicelogo?: string | null
          loginlink?: string | null
          name?: string | null
          paths?: string | null
          phone?: string | null
          websiteid?: number
        }
        Relationships: []
      }
    }
    Views: {
      vw_order_details: {
        Row: {
          cancelled: boolean | null
          clientname: string | null
          country: string | null
          delaydate: string | null
          orderbilled: number | null
          orderdate: string | null
          orderid: number | null
          orderstatus: string | null
          payment: string | null
          prioritize: number | null
          shipper: string | null
          state: string | null
          totalsale: number | null
          website: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_saul: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      postgres_fdw_disconnect: {
        Args: {
          "": string
        }
        Returns: boolean
      }
      postgres_fdw_disconnect_all: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      postgres_fdw_get_connections: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>[]
      }
      postgres_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
