codeunit 50200 "Report Layout Management"
{
    SingleInstance = true;

    var
        IsIntialized: Boolean;
        ReportId: Integer;
        LayoutName: Text;
        ReportLayoutType: ReportLayoutType;

    procedure SelectReportLayout(ObjectId: Integer; LayoutCode: Text; LayoutType: ReportLayoutType)
    begin
        IsIntialized := true;
        ReportId := ObjectId;
        LayoutName := LayoutCode;
        ReportLayoutType := LayoutType;
    end;

    [EventSubscriber(ObjectType::Codeunit, Codeunit::ReportManagement, OnSelectReportLayoutCode, '', false, false)]
    local procedure ReportManagement_OnSelectReportLayoutCode(ObjectId: Integer; var LayoutCode: Text; var LayoutType: Option; var IsHandled: Boolean)
    begin
        if not IsIntialized then exit;
        ObjectId := ReportId;
        LayoutCode := LayoutName;
        LayoutType := GetReportLayoutSelectionCorrespondingEnum(ReportLayoutType);
        IsHandled := true;
        ClearAllVariables();
    end;

    local procedure GetReportLayoutSelectionCorrespondingEnum(ReportLayoutType: ReportLayoutType): Integer
    begin
        case ReportLayoutType of
            ReportLayoutType::RDLC:
                exit(1);
            ReportLayoutType::Word:
                exit(2);
            ReportLayoutType::Excel:
                exit(3);
            ReportLayoutType::Custom:
                exit(4)
            else
                exit(0);
        end
    end;

    local procedure ClearAllVariables()
    begin
        Clear(IsIntialized);
        Clear(ReportId);
        Clear(LayoutName);
        Clear(ReportLayoutType);
    end;
}
