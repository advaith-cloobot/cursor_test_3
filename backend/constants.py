JWT_SECRET = 'BDa8yfPp29X918cA2e7w'

JWT_EXP_DELTA_SECONDS = 86400 * 30



GPT_35_16K = 0
OPENAI_ENGINE_NAME_GPT3_5_16K = "Cloobot-ChatGPT3-16k"
OPENAI_ENGINE_NAME_GPT3_5_16K_V2 = "Cloobot-ChatGPT35-16k-SwitzNorth"
OPENAI_ENGINE_NAME_GPT3_5_16K_V3 = "Cloobot-ChatGPT35-16k-SwitzNorth"

GPT_4_32K = 1
OPENAI_ENGINE_NAME_GPT4_32K = "Cloobot-32K-GPT4"
OPENAI_ENGINE_NAME_GPT4_32K_V2 = "Cloobot-ChatGPT4-32k-SwitzNorth"
OPENAI_ENGINE_NAME_GPT4_32K_V3 = "Cloobot-ChatGPT4-32k-CanadaEast"

GPT_VECT_EMBED = 2
OPENAI_ENGINE_NAME_GPT_VECT_EMBED = "Cloobot-ChatGPT4-VectEmbed-32k-EastUS"

GPT_4o_50k = 3
OPENAI_ENGINE_NAME_GPT4o_50k = "GPT4o"

GPT_4O_12K = 4
OPENAI_ENGINE_NAME_GPT4O_12K = "brd_image_indexing"


OpenAI_Res_Depl_ID_Map = {}
OpenAI_Res_Depl_ID_Map[OPENAI_ENGINE_NAME_GPT_VECT_EMBED] = "vector_embedding_test_1"


per_gpt_token_cost = {}
per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT3_5_16K] = {}
per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT3_5_16K][0] = 0.025    #input
per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT3_5_16K][1] = 0.04     #output

per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT4_32K] = {}
per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT4_32K][0] = 0.5
per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT4_32K][1] = 1

per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT3_5_16K_V2] = {}
per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT3_5_16K_V2][0] = 0.025    #input
per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT3_5_16K_V2][1] = 0.04     #output

per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT4_32K_V2] = {}
per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT4_32K_V2][0] = 0.5
per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT4_32K_V2][1] = 1

per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT3_5_16K_V3] = {}
per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT3_5_16K_V3][0] = 0.025    #input
per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT3_5_16K_V3][1] = 0.04     #output

per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT4_32K_V3] = {}
per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT4_32K_V3][0] = 0.5
per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT4_32K_V3][1] = 1

per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT_VECT_EMBED] = {}
per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT_VECT_EMBED][0] = 0.5
per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT_VECT_EMBED][1] = 1

per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT4o_50k] = {}
per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT4o_50k][0] = 0.5
per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT4o_50k][1] = 1

per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT4O_12K] = {}
per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT4O_12K][0] = 0.5
per_gpt_token_cost[OPENAI_ENGINE_NAME_GPT4O_12K][1] = 1


JSON_OBJ = 0
JSON_LIST = 1
JSON_NONE = 2





pg_col_name_dict = {}
PG_TABLE_IDS_USERS = "users"

# Constants for "users" table
pg_col_name_dict[PG_TABLE_IDS_USERS] = {}
pg_col_name_dict[PG_TABLE_IDS_USERS][0] = 'user_id'
pg_col_name_dict[PG_TABLE_IDS_USERS][1] = 'user_name'
pg_col_name_dict[PG_TABLE_IDS_USERS][3] = 'user_password'
pg_col_name_dict[PG_TABLE_IDS_USERS][2] = 'user_email'
pg_col_name_dict[PG_TABLE_IDS_USERS][4] = 'created_timestamp'
pg_col_name_dict[PG_TABLE_IDS_USERS][5] = 'last_updated_timestamp'
pg_col_name_dict[PG_TABLE_IDS_USERS][6] = 'status'

PG_TABLE_IDS_USERS_user_id                  = 0
PG_TABLE_IDS_USERS_user_name                = 1
PG_TABLE_IDS_USERS_user_password            = 3
PG_TABLE_IDS_USERS_user_email               = 2
PG_TABLE_IDS_USERS_created_timestamp        = 4
PG_TABLE_IDS_USERS_last_updated_timestamp   = 5
PG_TABLE_IDS_USERS_status                   = 6




PG_TABLE_VEHICLE_REPAIR_INFO = "vehicle_repair_info"

# Constants for "vehicle_repair_info" table
pg_col_name_dict[PG_TABLE_VEHICLE_REPAIR_INFO] = {}
pg_col_name_dict[PG_TABLE_VEHICLE_REPAIR_INFO][0] = 'vr_id'
pg_col_name_dict[PG_TABLE_VEHICLE_REPAIR_INFO][1] = 'vr_user_id'
pg_col_name_dict[PG_TABLE_VEHICLE_REPAIR_INFO][2] = 'vr_vehicle_make'
pg_col_name_dict[PG_TABLE_VEHICLE_REPAIR_INFO][3] = 'vr_vehicle_model'
pg_col_name_dict[PG_TABLE_VEHICLE_REPAIR_INFO][4] = 'vr_vehicle_type'
pg_col_name_dict[PG_TABLE_VEHICLE_REPAIR_INFO][5] = 'vr_vehicle_gear_type'
pg_col_name_dict[PG_TABLE_VEHICLE_REPAIR_INFO][6] = 'vr_vehicle_issues'
pg_col_name_dict[PG_TABLE_VEHICLE_REPAIR_INFO][7] = 'vr_possible_fixes'
pg_col_name_dict[PG_TABLE_VEHICLE_REPAIR_INFO][8] = 'vr_estimated_cost'
pg_col_name_dict[PG_TABLE_VEHICLE_REPAIR_INFO][9] = 'status'

PG_TABLE_VEHICLE_REPAIR_INFO_vr_id               = 0
PG_TABLE_VEHICLE_REPAIR_INFO_vr_user_id          = 1
PG_TABLE_VEHICLE_REPAIR_INFO_vr_vehicle_make     = 2
PG_TABLE_VEHICLE_REPAIR_INFO_vr_vehicle_model    = 3
PG_TABLE_VEHICLE_REPAIR_INFO_vr_vehicle_type     = 4
PG_TABLE_VEHICLE_REPAIR_INFO_vr_vehicle_gear_type = 5
PG_TABLE_VEHICLE_REPAIR_INFO_vr_vehicle_issues   = 6
PG_TABLE_VEHICLE_REPAIR_INFO_vr_possible_fixes   = 7
PG_TABLE_VEHICLE_REPAIR_INFO_vr_estimated_cost   = 8
PG_TABLE_VEHICLE_REPAIR_INFO_status              = 9




PG_TABLE_PAYMENT_INVOICE = "payment_invoice"

# Constants for "payment_invoice" table
pg_col_name_dict[PG_TABLE_PAYMENT_INVOICE] = {}
pg_col_name_dict[PG_TABLE_PAYMENT_INVOICE][0] = 'pi_id'
pg_col_name_dict[PG_TABLE_PAYMENT_INVOICE][1] = 'pi_user_id'
pg_col_name_dict[PG_TABLE_PAYMENT_INVOICE][2] = 'pi_vr_id'
pg_col_name_dict[PG_TABLE_PAYMENT_INVOICE][3] = 'pi_mobile_number'
pg_col_name_dict[PG_TABLE_PAYMENT_INVOICE][4] = 'pi_address'
pg_col_name_dict[PG_TABLE_PAYMENT_INVOICE][5] = 'pi_mode_of_payment'
pg_col_name_dict[PG_TABLE_PAYMENT_INVOICE][6] = 'pi_bank'
pg_col_name_dict[PG_TABLE_PAYMENT_INVOICE][7] = 'pi_bill_amount'
pg_col_name_dict[PG_TABLE_PAYMENT_INVOICE][8] = 'pi_created_user_id'
pg_col_name_dict[PG_TABLE_PAYMENT_INVOICE][9] = 'pi_created_timestamp'
pg_col_name_dict[PG_TABLE_PAYMENT_INVOICE][10] = 'pi_last_updated_user_id'
pg_col_name_dict[PG_TABLE_PAYMENT_INVOICE][11] = 'pi_last_updated_timestamp'
pg_col_name_dict[PG_TABLE_PAYMENT_INVOICE][12] = 'status'

PG_TABLE_PAYMENT_INVOICE_pi_id                    = 0
PG_TABLE_PAYMENT_INVOICE_pi_user_id               = 1
PG_TABLE_PAYMENT_INVOICE_pi_vr_id                 = 2
PG_TABLE_PAYMENT_INVOICE_pi_mobile_number         = 3
PG_TABLE_PAYMENT_INVOICE_pi_address               = 4
PG_TABLE_PAYMENT_INVOICE_pi_mode_of_payment       = 5
PG_TABLE_PAYMENT_INVOICE_pi_bank                  = 6
PG_TABLE_PAYMENT_INVOICE_pi_bill_amount           = 7
PG_TABLE_PAYMENT_INVOICE_pi_created_user_id       = 8
PG_TABLE_PAYMENT_INVOICE_pi_created_timestamp     = 9
PG_TABLE_PAYMENT_INVOICE_pi_last_updated_user_id  = 10
PG_TABLE_PAYMENT_INVOICE_pi_last_updated_timestamp = 11
PG_TABLE_PAYMENT_INVOICE_status                   = 12

# Salesforce SOW System Prompt
SALESFORCE_SOW_SYSTEM_PROMPT = """## **Prompt Instruction: Salesforce Implementation Scope Extractor**

### **Objective**

You are an AI assistant specialized in **Salesforce Implementation Consulting**.
Your goal is to **analyze uploaded documents** such as the *Sales Hand-off Package* or *Statement of Work (SoW)* and extract all information needed to define **Project Scope, Modules, Processes, Stakeholders, and License Inventory**.

The final output **must be a single valid JSON block**, wrapped in **Markdown format**, with all content written inside each key's value (not as external commentary).

---

### **Input**

* User will upload one or more documents (SoW, Sales hand-off package, BRD, etc.)
* Each may contain business unit details, module descriptions, in-scope and out-of-scope items, stakeholders, and Salesforce licensing information.

---

### **Task Instructions**

1. **Read and interpret** all uploaded content carefully.
2. **Extract**:

   * **Scope Summary**

     * `in_scope`: Items, functionalities, modules, integrations, or processes explicitly in scope.
     * `out_of_scope`: Anything marked as excluded, deferred, or future phase.
   * **Modules and Processes**

     * Identify each major *business module* (e.g., Lead Management, Order Processing, Case Management).
     * For each module, extract its *key processes* or *sub-functions*.
   * **Business Units & Stakeholders**

     * Identify all *business units/departments* mentioned.
     * Under each BU, list:

       * Stakeholder Name
       * Designation/Role
       * Email (if available)
   * **Salesforce Licenses**

     * Identify all Salesforce license types (Sales Cloud, Service Cloud, FSL, Platform, etc.)
     * Include quantity or allocation if mentioned.

---

### **Output Format**

Produce the output **as a single JSON object inside Markdown code fences**:

```json
{
  "scope_summary": {
    "in_scope": [
      "List each in-scope item here in Markdown bullet format"
    ],
    "out_of_scope": [
      "List each out-of-scope item here in Markdown bullet format"
    ]
  },
  "modules": [
    {
      "module_name": "Module 1 Name",
      "description": "Short description of what this module covers",
      "processes": [
        "- Process 1: short description",
        "- Process 2: short description"
      ]
    }
  ],
  "business_units": [
    {
      "business_unit_name": "BU Name",
      "stakeholders": [
        {
          "name": "Full Name",
          "designation": "Designation / Role",
          "email": "email@example.com"
        }
      ]
    }
  ],
  "salesforce_licenses": [
    {
      "license_type": "Sales Cloud / Service Cloud / Platform / FSL / etc.",
      "count": "Number if available, else 'unknown'"
    }
  ],
  "assumptions": [
    "State all assumptions made to fill gaps in missing data"
  ],
  "validation_summary": {
    "json_validity": "true/false",
    "issues_detected": [
      "List any issues or inconsistencies found in the extracted data"
    ]
  }
}
```

---

### **Validation Rules**

1. Output must be **strictly valid JSON**:

   * All keys must be **double-quoted**.
   * Arrays and objects must be **properly closed**.
   * No trailing commas.
   * No comments outside JSON (everything must be within Markdown code fences).
2. All string values must be properly escaped (`\"`, `\\n`).
3. If any field cannot be found, include a **placeholder** with `"unknown"` or `"not specified"`.
4. If you infer something, list the **assumption** explicitly in the `"assumptions"` array.

---

### **Assumption Rules**

* If business units are not explicitly named, infer them from context (e.g., "Sales," "Service," "Finance," etc.).
* If stakeholder details are incomplete, infer plausible placeholders:

  * `"name": "Not Provided"`
  * `"designation": "Inferred based on context"`
  * `"email": "unknown@example.com"`
* If Salesforce license type is unclear, infer `"Platform"` as a default placeholder but note it under `"assumptions"`.
* Maintain logical consistency (e.g., do not assign Service Cloud features to a client with only Sales Cloud licenses).

---

### **Tone and Format Requirements**

* Use **Markdown** formatting for the entire JSON output block.
* Do **not** include any prose, commentary, or explanation outside the JSON block.
* Ensure the structure is **complete, human-readable, and machine-parsable**

*important note:Ensure that the stakesholder details are extracted from the file content from the business units sub sections like Corporate Housing, transportation etc
"""