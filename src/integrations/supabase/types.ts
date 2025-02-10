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
      activity_log: {
        Row: {
          action_type: string
          created_at: string | null
          details: Json | null
          entity_id: string
          entity_type: string
          id: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          details?: Json | null
          entity_id: string
          entity_type: string
          id?: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
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
      client_changelog: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          client_id: number
          comment: string | null
          field_name: string
          id: number
          new_value: string | null
          old_value: string | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          client_id: number
          comment?: string | null
          field_name: string
          id?: number
          new_value?: string | null
          old_value?: string | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          client_id?: number
          comment?: string | null
          field_name?: string
          id?: number
          new_value?: string | null
          old_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_changelog_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["clientid"]
          },
          {
            foreignKeyName: "client_changelog_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "mv_client_lifetime_value"
            referencedColumns: ["clientid"]
          },
          {
            foreignKeyName: "client_changelog_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "mv_client_order_counts"
            referencedColumns: ["clientid"]
          },
          {
            foreignKeyName: "client_changelog_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "vw_client_risk_summary"
            referencedColumns: ["clientid"]
          },
        ]
      }
      client_risk_assessments: {
        Row: {
          assessed_by: string | null
          client_id: number
          created_at: string | null
          id: string
          is_flagged: boolean | null
          last_assessed_at: string | null
          notes: string | null
          risk_level: number
          updated_at: string | null
        }
        Insert: {
          assessed_by?: string | null
          client_id: number
          created_at?: string | null
          id?: string
          is_flagged?: boolean | null
          last_assessed_at?: string | null
          notes?: string | null
          risk_level?: number
          updated_at?: string | null
        }
        Update: {
          assessed_by?: string | null
          client_id?: number
          created_at?: string | null
          id?: string
          is_flagged?: boolean | null
          last_assessed_at?: string | null
          notes?: string | null
          risk_level?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_risk_assessments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["clientid"]
          },
          {
            foreignKeyName: "client_risk_assessments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "mv_client_lifetime_value"
            referencedColumns: ["clientid"]
          },
          {
            foreignKeyName: "client_risk_assessments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "mv_client_order_counts"
            referencedColumns: ["clientid"]
          },
          {
            foreignKeyName: "client_risk_assessments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "vw_client_risk_summary"
            referencedColumns: ["clientid"]
          },
        ]
      }
      client_risk_factors: {
        Row: {
          assessment_id: string | null
          created_at: string | null
          description: string | null
          factor_type: Database["public"]["Enums"]["risk_factor_type"]
          id: string
          impact_score: number
        }
        Insert: {
          assessment_id?: string | null
          created_at?: string | null
          description?: string | null
          factor_type: Database["public"]["Enums"]["risk_factor_type"]
          id?: string
          impact_score: number
        }
        Update: {
          assessment_id?: string | null
          created_at?: string | null
          description?: string | null
          factor_type?: Database["public"]["Enums"]["risk_factor_type"]
          id?: string
          impact_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "client_risk_factors_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "client_risk_assessments"
            referencedColumns: ["id"]
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
          {
            foreignKeyName: "fk_clientrx"
            columns: ["rxid"]
            isOneToOne: false
            referencedRelation: "vw_order_prescriptions"
            referencedColumns: ["rx_id"]
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
      dashboard_preferences: {
        Row: {
          created_at: string | null
          id: string
          preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string | null
          user_id?: string
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
          {
            foreignKeyName: "fk_newdrugdetails_drug"
            columns: ["drugid"]
            isOneToOne: false
            referencedRelation: "vw_product_catalog"
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
      notifications: {
        Row: {
          category: string
          created_at: string | null
          id: string
          link: string | null
          message: string
          priority: string
          read: boolean | null
          title: string
          type: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          link?: string | null
          message: string
          priority: string
          read?: boolean | null
          title: string
          type: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string
          priority?: string
          read?: boolean | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      order_delays: {
        Row: {
          delay_reason: string
          id: string
          order_id: number
          reported_at: string | null
          reported_by: string | null
          resolved_at: string | null
          resolved_by: string | null
        }
        Insert: {
          delay_reason: string
          id?: string
          order_id: number
          reported_at?: string | null
          reported_by?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Update: {
          delay_reason?: string
          id?: string
          order_id?: number
          reported_at?: string | null
          reported_by?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_delays_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_delays_order_id_fkey1"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_stock_issues: {
        Row: {
          drug_detail_id: number
          id: string
          notes: string | null
          order_id: number
          reported_at: string | null
          reported_by: string | null
          resolved_at: string | null
          resolved_by: string | null
        }
        Insert: {
          drug_detail_id: number
          id?: string
          notes?: string | null
          order_id: number
          reported_at?: string | null
          reported_by?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Update: {
          drug_detail_id?: number
          id?: string
          notes?: string | null
          order_id?: number
          reported_at?: string | null
          reported_by?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_stock_issues_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_stock_issues_order_id_fkey1"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_warehouse_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          notes: string | null
          order_id: number
          warehouse_id: number
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          notes?: string | null
          order_id: number
          warehouse_id: number
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          notes?: string | null
          order_id?: number
          warehouse_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_warehouse_assignments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_warehouse_assignments_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
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
      payment_tracking: {
        Row: {
          amount: number
          id: string
          last_attempt: string | null
          notes: string | null
          order_id: number
          reminder_sent_at: string | null
          retry_count: number | null
          status: string
        }
        Insert: {
          amount: number
          id?: string
          last_attempt?: string | null
          notes?: string | null
          order_id: number
          reminder_sent_at?: string | null
          retry_count?: number | null
          status: string
        }
        Update: {
          amount?: number
          id?: string
          last_attempt?: string | null
          notes?: string | null
          order_id?: number
          reminder_sent_at?: string | null
          retry_count?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_tracking_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_tracking_order_id_fkey1"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
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
          drug_detail_id: number | null
          drug_id: number | null
          id: string
          last_updated: string | null
          updated_by: string | null
        }
        Insert: {
          count?: number
          created_at?: string | null
          drug_detail_id?: number | null
          drug_id?: number | null
          id?: string
          last_updated?: string | null
          updated_by?: string | null
        }
        Update: {
          count?: number
          created_at?: string | null
          drug_detail_id?: number | null
          drug_id?: number | null
          id?: string
          last_updated?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_counts_drug_detail_id_fkey"
            columns: ["drug_detail_id"]
            isOneToOne: false
            referencedRelation: "newdrugdetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_counts_drug_detail_id_fkey"
            columns: ["drug_detail_id"]
            isOneToOne: false
            referencedRelation: "vw_product_catalog"
            referencedColumns: ["drug_detail_id"]
          },
          {
            foreignKeyName: "stock_counts_drug_id_fkey"
            columns: ["drug_id"]
            isOneToOne: false
            referencedRelation: "newdrugs"
            referencedColumns: ["drugid"]
          },
          {
            foreignKeyName: "stock_counts_drug_id_fkey"
            columns: ["drug_id"]
            isOneToOne: false
            referencedRelation: "vw_product_catalog"
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
      warehouses: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          id: number
          is_active: boolean | null
          name: string
          state: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: never
          is_active?: boolean | null
          name: string
          state?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: never
          is_active?: boolean | null
          name?: string
          state?: string | null
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
      mv_client_lifetime_value: {
        Row: {
          clientid: number | null
          lifetime_value: number | null
        }
        Relationships: []
      }
      mv_client_order_counts: {
        Row: {
          clientid: number | null
          total_orders: number | null
        }
        Relationships: []
      }
      mv_dashboard_metrics: {
        Row: {
          avg_order_value: number | null
          new_clients_month: number | null
          orders_month: number | null
          orders_today: number | null
          orders_week: number | null
          revenue_month: number | null
          revenue_today: number | null
          revenue_week: number | null
          total_clients: number | null
          total_orders: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
      mv_order_details: {
        Row: {
          cancelled: boolean | null
          clientid: number | null
          clientname: string | null
          country: string | null
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
      vw_client_risk_summary: {
        Row: {
          clientid: number | null
          email: string | null
          firstname: string | null
          is_flagged: boolean | null
          last_assessed_at: string | null
          lastname: string | null
          risk_level: number | null
          risk_types: string | null
          total_risk_factors: number | null
        }
        Relationships: []
      }
      vw_order_details: {
        Row: {
          cancelled: boolean | null
          clientid: number | null
          clientname: string | null
          country: string | null
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
      vw_order_prescriptions: {
        Row: {
          clientid: number | null
          dateuploaded: string | null
          duration: string | null
          filled: number | null
          orderid: number | null
          refills: number | null
          rx_id: number | null
          rx_image: string | null
          rxdate: string | null
          strength: string | null
        }
        Relationships: []
      }
      vw_product_catalog: {
        Row: {
          available: boolean | null
          brand: boolean | null
          canada_cost_usd: number | null
          chemical: string | null
          defaultshipper: number | null
          drug_detail_id: number | null
          drugid: number | null
          form: number | null
          ivf: boolean | null
          nameil: string | null
          nameus: string | null
          otc: boolean | null
          packsize: number | null
          prescription: boolean | null
          saledollar: number | null
          salenis: number | null
          shipper_name: string | null
          strength: string | null
          supplier: number | null
          supplier_full_name: string | null
          supplier_name: string | null
          turkey_cost_usd: number | null
          turkeycostprice: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_client_lifetime_values: {
        Args: {
          client_ids: number[]
        }
        Returns: {
          clientid: number
          total: number
        }[]
      }
      get_client_order_counts: {
        Args: {
          client_ids: number[]
        }
        Returns: {
          clientid: number
          count: number
        }[]
      }
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
      risk_factor_type:
        | "payment_failure"
        | "chargeback"
        | "multiple_addresses"
        | "prescription_issues"
        | "suspicious_ordering_pattern"
        | "failed_verification"
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
