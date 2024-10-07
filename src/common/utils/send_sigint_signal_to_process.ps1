
param (
    [string]$ProcessID
 )
$MemberDefinition = '
    [DllImport("kernel32.dll")]public static extern bool FreeConsole();
    [DllImport("kernel32.dll")]public static extern bool AttachConsole(uint p);
    [DllImport("kernel32.dll")]public static extern bool GenerateConsoleCtrlEvent(uint e, uint p);
    public static void SendCtrlC(uint p) {
        FreeConsole();
        if (AttachConsole(p)) {
            GenerateConsoleCtrlEvent(0, p);
            FreeConsole();
        }
        AttachConsole(uint.MaxValue);
    }'
Add-Type -Name 'dummyName' -Namespace 'dummyNamespace' -MemberDefinition $MemberDefinition
[dummyNamespace.dummyName]::SendCtrlC($ProcessID) 