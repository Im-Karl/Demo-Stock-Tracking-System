import os
import re

directory = "/home/muffin/Desktop/University/Undergrad-Research/StockEx/frontend/src"

mapping = {
  "FileText": "RiFileTextFill",
  "Home": "RiHomeFill",
  "Camera": "RiCameraFill",
  "HelpCircle": "RiQuestionFill",
  "Send": "RiSendPlaneFill",
  "Info": "RiInformationFill",
  "Trash2": "RiDeleteBinFill",
  "Newspaper": "RiNewspaperFill",
  "Search": "RiSearchLine",
  "Users": "RiGroupFill",
  "Trophy": "RiTrophyFill",
  "Lock": "RiLockFill",
  "Heart": "RiHeartFill",
  "AlertCircle": "RiErrorWarningFill",
  "ImagePlus": "RiImageAddFill",
  "Loader2": "RiLoader4Fill",
  "Moon": "RiMoonFill",
  "KeyRound": "RiKeyFill",
  "ChevronDown": "RiArrowDownSFill",
  "Sun": "RiSunFill",
  "Globe": "RiEarthFill",
  "ArrowUp": "RiArrowUpFill",
  "Activity": "RiPulseFill",
  "ArrowDown": "RiArrowDownFill",
  "CornerDownRight": "RiCornerDownRightFill",
  "FileEdit": "RiFileEditFill",
  "MessageSquare": "RiMessage2Fill",
  "ExternalLink": "RiExternalLinkFill",
  "Reply": "RiReplyFill",
  "Phone": "RiPhoneFill",
  "RotateCcw": "RiRestartFill",
  "LogOut": "RiLogoutBoxRFill",
  "ChevronUp": "RiArrowUpSFill",
  "Mail": "RiMailFill",
  "XCircle": "RiCloseCircleFill",
  "User": "RiUserFill",
  "X": "RiCloseFill",
  "BarChart3": "RiBarChartFill",
  "Edit": "RiEdit2Fill",
  "RefreshCcw": "RiRefreshFill",
  "UserPlus": "RiUserAddFill",
  "ArrowUpDown": "RiArrowUpDownFill",
  "TrendingUp": "RiStockFill"
}

for root, _, files in os.walk(directory):
    for file in files:
        if not file.endswith((".jsx", ".tsx", ".js", ".ts", ".astro")): continue
        filepath = os.path.join(root, file)
        
        with open(filepath, "r") as f:
            content = f.read()
            
        if "lucide-react" not in content:
            continue
            
        import_match = re.search(r'import\s+\{([^}]+)\}\s+from\s+[\'"]lucide-react[\'"];?', content)
        if not import_match:
            continue
            
        imported_str = import_match.group(1)
        symbols = [s.strip() for s in imported_str.split(',')]
        symbols = [s for s in symbols if s]
        
        new_symbols = []
        replacements = []
        
        for symbol in symbols:
            parts = symbol.split(" as ")
            orig = parts[0].strip()
            alias = parts[1].strip() if len(parts) > 1 else orig
            
            if orig in mapping:
                remix_icon = mapping[orig]
                if alias != orig:
                    # e.g., User as UserIcon
                    new_symbols.append(f"{remix_icon} as {alias}")
                    # no replacement in body, since alias is used
                else:
                    new_symbols.append(remix_icon)
                    replacements.append((orig, remix_icon))
            else:
                new_symbols.append(symbol)
                
        # 1. replace import
        new_import_str = "import { " + ", ".join(new_symbols) + " } from 'react-icons/ri';"
        content = content[:import_match.start()] + new_import_str + content[import_match.end():]
        
        # 2. replace tags in JSX (e.g. <Home, </Home>, icon={Home})
        for orig, remix_icon in replacements:
            # tag start
            content = re.sub(r'<(' + orig + r')(\s|/|>)', r'<' + remix_icon + r'\2', content)
            # tag end
            content = re.sub(r'</(' + orig + r')>', r'</' + remix_icon + r'>', content)
            # as a prop like icon={Home} or icon: Home
            # just word boundary match if it's not preceded by a dot (like style.Home) or quotes
            # Actually, to be very safe, let's just replace `\bOrig\b` if it's preceded by `{` or `:\s*` or `\[` or `\(` or ` `
            # A simpler way is to replace `\bOrig\b` anywhere it appears EXCEPT in strings or object keys.
            # But the alias trick handles this implicitly if we alias it!
            # Let's check where it appears.
            
            # For safe replacement, we can replace exact word boundaries but avoid 'import' lines
            # A safe way is to replace `{Orig}` -> `{Remix}` and `icon={Orig}` -> `icon={Remix}`
            content = re.sub(r'([({,:\s])' + orig + r'([)}.,\s])', r'\1' + remix_icon + r'\2', content)
            # Do it twice to handle overlapping matches like `{ Home, Search }` -> `{ RiHomeFill, Search }` -> `{ RiHomeFill, RiSearchLine }`
            content = re.sub(r'([({,:\s])' + orig + r'([)}.,\s])', r'\1' + remix_icon + r'\2', content)
            
        with open(filepath, "w") as f:
            f.write(content)
            
        print("Updated", filepath)
