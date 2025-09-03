page 50100 "Sales Header Api"
{
    SourceTable = "Sales Header";

    PageType = API;
    APIPublisher = 'Shubham';
    APIGroup = 'BC';
    APIVersion = 'v2.0';
    EntityName = 'Sales';
    EntitySetName = 'SalesHeaders';

    DelayedInsert = true;
    ODataKeyFields = SystemId;

    layout
    {
        area(Content)
        {
            repeater(General)
            {
                Caption = 'General';

                field(SystemId; Rec.SystemId)
                {
                    ApplicationArea = All;
                }

                field(DocumentType; Rec."Document Type")
                {
                    ToolTip = 'Specifies the value of the Document Type field.', Comment = '%';
                }
                field(SellToCustomerNo; Rec."Sell-to Customer No.")
                {
                    ToolTip = 'Specifies the number of the customer who will receive the products and be billed by default.';
                }
                field(No; Rec."No.")
                {
                    ToolTip = 'Specifies the number of the involved entry or record, according to the specified number series.';
                }
                field(ExternalDocumentNo; Rec."External Document No.")
                {
                    ToolTip = 'Specifies a document number that refers to the customer''s or vendor''s numbering system.';
                }
                field(BillToCustomerNo; Rec."Bill-to Customer No.")
                {
                    ToolTip = 'Specifies the number of the customer that you send or sent the invoice or credit memo to.';
                }
                field(BillToName; Rec."Bill-to Name")
                {
                    ToolTip = 'Specifies the customer to whom you will send the invoice, when different from the customer that you are selling to.';
                }
                field(BillToName2; Rec."Bill-to Name 2")
                {
                    ToolTip = 'Specifies the value of the Bill-to Name 2 field.', Comment = '%';
                }
                field(BillToAddress; Rec."Bill-to Address")
                {
                    ToolTip = 'Specifies the address of the customer that you will send the invoice to.';
                }
                field(BillToAddress2; Rec."Bill-to Address 2")
                {
                    ToolTip = 'Specifies an additional part of the billing address.';
                }
                field(YourReference; Rec."Your Reference")
                {
                    ToolTip = 'Specifies the customer''s reference. The content will be printed on sales documents.';
                }
                field(OrderDate; Rec."Order Date")
                {
                    ToolTip = 'Specifies the date when the order was created.';
                }
                field(PostingDate; Rec."Posting Date")
                {
                    ToolTip = 'Specifies the date when the posting of the sales document will be recorded.';
                }
                field(ShipmentDate; Rec."Shipment Date")
                {
                    ToolTip = 'Specifies when items on the document are shipped or were shipped. A shipment date is usually calculated from a requested delivery date plus lead time.';
                }
            }
        }
    }

    trigger OnInsertRecord(BelowxRec: Boolean): Boolean
    var
        SalesHeader: Record "Sales Header";
    begin
        Clear(SalesHeader);
        SalesHeader.SetRange("Document Type", Rec."Document Type");
        SalesHeader.SetRange("No.", Rec."No.");
        if SalesHeader.FindFirst() then begin
            SalesHeader.Copy(Rec);
            SalesHeader.Modify(true);
            exit(false);
        end;
    end;
}
